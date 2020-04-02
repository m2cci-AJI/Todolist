import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from 'src/app/services/list.service';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.css']
})
export class DeleteListComponent implements OnInit {
  list: List;
  constructor(private dialogRef: MatDialogRef<DeleteListComponent>,
              private listService: ListService,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data !== null) {
        this.list = data.data;
   }
    }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant de fermer la fenetre popup

  onDeleteList() {
    this.listService.deleteList(this.list);
    this.dialogRef.close({action: 1, data: this.listService.lists});
  } // méthode permettant de supprimer une tache de la liste de taches dans le service
  // et d'envoyer la nouvelle liste au composant parent

}
