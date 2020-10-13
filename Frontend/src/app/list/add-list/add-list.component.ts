import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { MatDialogRef } from '@angular/material/dialog';
import { ListService } from 'src/app/services/list.service';
import { CategoryService } from 'src/app/services/category.service';
import { List } from 'src/app/models/list.model';
import { spot } from 'src/app/models/list.enum';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent implements OnInit, OnDestroy {
  typeList: string = 'ponctuel';
  categories: Category[];
  dateDebut: Date = new Date();
  errorDate: boolean = false;
  getCategoriesSubscribing: Subscription;
  addlistSubscribing: Subscription;
  constructor(private dialogRef: MatDialogRef<AddListComponent>,
              private listService: ListService,
              private categoryService: CategoryService,
              private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.getCategoriesSubscribing = this.categoryService.getCategories(this.authentificationService.id).subscribe((data) => {
      this.categories = ((data.body) as any).Data;
    });
  }

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant de fermer une fenetre modale

  compareTwoDates(f) {
    if (this.listService.changeFormatDate(f.controls.dp4.value) < this.listService.changeFormatDate(f.controls.dp3.value)) {
      this.errorDate = true;
    } else {
      this.errorDate = false;
    }
  }

  onAddList(value) {
    const nom = value.Nom;
    const type = value.Type;
    const isLate = this.listService.getIsLate(this.listService.changeFormatDate(value.dp3),
      this.listService.changeFormatDate(value.dp4), value.Percent, type);
    // affecter la valeur de la proprieté IsLate
    const dateFinReal = this.listService.getDateFinExact(value.Percent);
    const idCategory = this.categoryService.getIdfromCategory(value.Category, this.categories);
    const idUser = this.authentificationService.id;
    const list = new List(nom, type, this.listService.changeFormatDate(value.dp3),
      this.listService.changeFormatDate(value.dp4), dateFinReal, false, isLate, value.Percent, idCategory, idUser);
    this.addlistSubscribing = this.listService.addList(list).subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    });
    this.dialogRef.close({ action: 1 });
  } // méthode permettant d'ajouter une tache à la liste de taches et de fermer la fenetre par la suite

  ngOnDestroy() {
     this.getCategoriesSubscribing.unsubscribe();
     this.addlistSubscribing.unsubscribe();
  }

}
