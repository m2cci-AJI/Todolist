import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Options } from 'ng5-slider';
import { spot } from 'src/app/models/list.enum';
import { CategoryService } from 'src/app/services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.css']
})
export class DetailsListComponent implements OnInit, AfterViewInit, OnDestroy {
  info: string;
  nomList: string;
  typeList: string;
  categoryList: string;
  dateDebutList: Date;
  dateFinList: Date;
  dateFinRList: Date;
  isLateList: string;
  percentList: number;
  id: any;
  value: number;
  options1: Options = {
    disabled: true,
    floor: 0,
    ceil: 100,
    tickStep: 25,
    showTicks: true,
    getLegend: (value: number): string => {
      if (value === 0) {
        return 'Debut';
      } else if (value === 25) {
        return '1ère échéance';
      } else if (value === 50) {
        return '2éme échéance';
      } else if (value === 75) {
        return '3éme échéance';
      } else if (value === 100) {
        return 'Fin';
      }
    }
  };
  options2: Options = {
    disabled: true,
    floor: 0,
    ceil: 100,
    tickStep: 100,
    showTicks: true,
    getLegend: (value: number): string => {
      if (value === 0) {
        return 'Debut';
      } else if (value === 100) {
        return 'Fin';
      }
    }
  };
  getListSubscribing: Subscription;
  getCategorySubscribing: Subscription;

  constructor(private dialogRef: MatDialogRef<DetailsListComponent>,
              private listService: ListService,
              private categoryService: CategoryService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data !== null) {
      this.id = data.data;
      this.info = data.info;
    }
  }

  ngAfterViewInit() {
    const elems = document.getElementsByClassName('ng5-slider-pointer') as HTMLCollectionOf<HTMLElement>;
    if (elems[0] !== undefined) {
      elems[0].style.backgroundColor = '#0db9f0';
    }
  }

  ngOnInit(): void {
    this.getListSubscribing = this.listService.getList(this.id).subscribe((data) => {
      console.log(data);
      const list = ((data.body) as any).Data;
      this.nomList = list['Nom'];
      this.typeList = list['Type'];
      this.getCategorySubscribing = this.categoryService.getCategory(list['idCategory']).subscribe((info) => {
        if (((info.body) as any).Data !== null) {
          this.categoryList = ((info.body) as any).Data.Nom;
        }
      },
      (err) => {
        console.log(err);
      });
      this.dateDebutList = list['DateDebut'];
      this.dateFinRList = list['DateFinExact'];
      this.dateFinList = list['DateFin'];
      this.isLateList = list['IsLate'];
      this.percentList = list['Percent'];
      this.getValueSlider();
    },
      (err) => {
        console.log(err);
      });
  } // méthode permettant d'affecter des valeurs aux proprietés

  getValueSlider() {
    const toDay = new Date();
    if ((toDay <= new Date(this.dateFinList)) && (toDay >= new Date(this.dateDebutList))) {
      const totalDays = this.listService.dateDiff(new Date(this.dateDebutList),
                                                  new Date(this.dateFinList)); // le total des jours de la tache
      const firstDays = this.listService.dateDiff(new Date(this.dateDebutList), toDay);
      // nombre de jours depuis le début de la tache jusqu'au moment présent
      this.value = (Math.floor((firstDays / totalDays) * 100));
    } else if (toDay > new Date(this.dateFinList)) {
      this.value = 100;
    } else if (toDay < new Date(this.dateDebutList)) {
      this.value = 0;
    }
  } // méthode permettant de donner la position de pointer de slider

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant la fermeture la fenetre popup

  getTypeList() {
    if (this.typeList === spot['0']) {
      return true; // type est ponctuel
    } else {
      return false; // type est au long cours
    }
  }

  ngOnDestroy() {
     this.getCategorySubscribing.unsubscribe();
     this.getListSubscribing.unsubscribe();
  }

}
