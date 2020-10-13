import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from 'src/app/services/list.service';
import { List } from 'src/app/models/list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.css']
})
export class DeleteListComponent implements OnInit, OnDestroy {
  id: any;
  deleteListSubscribing: Subscription;
  constructor(private dialogRef: MatDialogRef<DeleteListComponent>,
              private listService: ListService,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data !== null) {
        this.id = data.data;
   }
    }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant de fermer la fenetre popup

  onDeleteList() {
    this.deleteListSubscribing = this.listService.deleteList(this.id).subscribe((data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    });
    this.dialogRef.close({ action: 1 });
  } // méthode permettant de supprimer une tache de la liste de taches dans le service
  // et d'envoyer la nouvelle liste au composant parent

  ngOnDestroy() {
    this.deleteListSubscribing.unsubscribe();
  }

}
