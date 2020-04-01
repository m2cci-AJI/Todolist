import { Component, OnInit, Inject } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { List } from 'src/app/models/list.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.css']
})
export class DetailsListComponent implements OnInit {
  nomList: string;
  typeList: string;
  categoryList: string;
  dateDebutList: Date;
  dateFinList: Date;
  isLateList: string;
  percentList: number;
  index: number;

  constructor(private dialogRef: MatDialogRef<DetailsListComponent>,
              private listService: ListService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                if (data !== null) {
                  this.index = data.data;
                }
              }

  ngOnInit(): void {
    const lists: List[] = this.listService.getLists();
    this.nomList = lists[this.index]['Nom'];
    this.typeList = lists[this.index]['Type'];
    this.categoryList = lists[this.index]['Category'];
    this.dateDebutList = lists[this.index]['DateDebut'];
    this.dateFinList = lists[this.index]['DateFin'];
    this.isLateList = lists[this.index]['IsLate'];
    this.percentList = lists[this.index]['Percent'];
  } // méthode permettant d'affecter des valeurs aux proprietés

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant la fermeture la fenetre popup

}
