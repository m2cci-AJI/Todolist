import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from 'src/app/services/list.service';
import { List } from 'src/app/models/list.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})

export class EditListComponent implements OnInit {
  NomList: string;
  categories: Category[];
  typeList: string;
  CategoryList: string;
  DateDebutList: NgbDateStruct;
  DateFinList: NgbDateStruct;
  PercentList: number;
  isDone: boolean;
  id: any;
  lists: List[];
  errorDate: boolean;
  subscribeGetList: Subscription;
  subscriptionEditList: Subscription;
  subscriptionGetCategories1: Subscription;
  subscriptionGetCategories2: Subscription;
  constructor(private dialogRef: MatDialogRef<EditListComponent>,
              private listService: ListService,
              private categoryService: CategoryService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private authentificationService: AuthentificationService) {
    if (data !== null) {
      this.id = data.data;
    }
    this.subscriptionGetCategories1 = this.categoryService.getCategories(this.authentificationService.id).subscribe((info) => {
      this.categories = ((info.body) as any).Data;
    },
    (err) => {
      console.log(err);
    });
  }

  ngOnInit(): void {
      this.subscribeGetList = this.listService.getList(this.id).subscribe((data) => {
      const list = ((data.body) as any).Data;
      this.NomList = list['Nom'];
      this.typeList = list['Type'];
      this.subscriptionGetCategories2 = this.categoryService.getCategory(list['idCategory']).subscribe((info) => {
        if (((info.body) as any).Data !== null) {
          this.CategoryList = ((info.body) as any).Data.Nom;
        }
      },
      (err) => {
        console.log(err);
      });
      this.DateDebutList = this.changeDateToNgbDateStruct(new Date(list['DateDebut']));
      this.DateFinList = this.changeDateToNgbDateStruct(new Date(list['DateFin']));
      this.PercentList = list['Percent'];
      this.isDone = list['IsDone'];
    });
  } // initialisation de formulaire

  compareTwoDates(f) {
    if (this.listService.changeFormatDate(f.controls.dp4.value) < this.listService.changeFormatDate(f.controls.dp3.value)) {
      this.errorDate = true;
    } else {
      this.errorDate = false;
    }
  }

  changeDateToNgbDateStruct(date: Date): NgbDateStruct {
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
  } // changement du format de date

  changeNgbDateStructToDate(date: any): Date {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    return new Date(year + '-' + month + '-' + day);
  } // changement du format de date

  closeModal() {
    this.dialogRef.close();
  } // ferméture de fenetre popup

  onEditList(value) {
    const Nom = value.Nom;
    const Type = value.Type;
    const IsDone = this.isDone;
    const Percent = value.Percent;
    const isLate = this.listService.getIsLate(this.listService.changeFormatDate(value.dp3),
                                              this.listService.changeFormatDate(value.dp4), value.Percent, Type);
    const dateFinReal = this.listService.getDateFinExact(value.Percent);
    let idCategory;
    if (value.Category.length === 0) {
      idCategory = null;
    } else {
      idCategory = this.categoryService.getIdfromCategory(value.Category, this.categories);
    } // si l'utilsateur choisit None comme catégorie, id sera affecté à null
      // s'il choisit une catégorie, la fontion getIdfrmCategory va retourner son id.
    const idUser = this.authentificationService.id;
    const list = new List(Nom, Type, this.changeNgbDateStructToDate(value.dp3),
                          this.changeNgbDateStructToDate(value.dp4), dateFinReal, IsDone, isLate, Percent, idCategory, idUser);
    this.subscriptionEditList = this.listService.editList(this.id, list).subscribe((data) => {
        console.log(data);
        this.subscribeGetList.unsubscribe();
        this.subscriptionGetCategories1.unsubscribe();
        this.subscriptionGetCategories2.unsubscribe();
        this.subscriptionEditList.unsubscribe();
        this.dialogRef.close({ action: 1 });
    },
      (err) => {
        console.log(err);
      });
  } // méthode permettant d'ajouter une catégorie à la liste de catégorie

}
