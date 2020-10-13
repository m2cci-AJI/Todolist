import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})
export class DeleteCategoryComponent implements OnInit {
  index: number;
  deletCategorySubscribing: Subscription;
  constructor(private dialogRef: MatDialogRef<DeleteCategoryComponent>,
              private categoryService: CategoryService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                if (data !== null) {
                      this.index = data.data;
                 }
              }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant de fermer la fenetre popup

  onDeleteCategory() {
    this.deletCategorySubscribing = this.categoryService.deleteCategory(this.index).subscribe((data) => {
      console.log(data['message']);
      this.dialogRef.close({action: 1});
      this.deletCategorySubscribing.unsubscribe();
    },
    (err) => {
      console.log(err);
    });
  } // méthode permettant de supprimer une catégorie de la liste de catégories dans le service
    // et d'envoyer la nouvelle liste au composant parent
}
