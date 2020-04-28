import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  public thingForm: FormGroup;
  nomCategory: string;
  typeCategory: string;
  Type: string;
  index: number;
  public imagePreview: string;
  subscriptionGetCategories: Subscription;
  subscriptionEditCategory: Subscription;
  constructor(private dialogRef: MatDialogRef<EditCategoryComponent>,
              private categoryService: CategoryService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private authentificationService: AuthentificationService) {
    if (data !== null) {
      this.index = data.data;
    }
  }

  ngOnInit(): void {
    this.subscriptionGetCategories = this.categoryService.getCategory(this.index).subscribe((info) => {
      const category = ((info.body) as any).Data;
      this.nomCategory = category["Nom"];
      this.typeCategory = category["Type"];
      this.imagePreview = category["imageURL"];
      this.thingForm.patchValue({ Nom: this.nomCategory });
      this.thingForm.patchValue({ Type: this.typeCategory });
    },
    (err) => {
      console.log(err);
    }); // initialisation de formulaire
    this.thingForm = this.formBuilder.group({
      Nom: [null , Validators.required],
      Type: [null, Validators.required],
      image: [null]
  }); // création de formulaire
  }

  validForm() {
    return this.thingForm.status === 'INVALID';
  }

  closeModal() {
    this.dialogRef.close();
  } // fermeture de la fenetre popup

  onEditCategory() {
    const Nom = this.thingForm.get('Nom').value;
    const Type = this.thingForm.get('Type').value;
    const Photo = '';
    const idUser = this.authentificationService.id;
    const category = new Category(Nom, Type, idUser, Photo);
    this.subscriptionEditCategory = this.categoryService.editCategory(this.index, category, this.thingForm.get('image').value).subscribe((data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    });
    this.dialogRef.close({ action: 1 });
  } // méthode permettant d'ajouter une catégorie à la liste de catégorie

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.thingForm.get('image').patchValue(file);
    this.thingForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.thingForm.get('image').valid) {
        this.imagePreview = reader.result as string;
      } else {
        this.imagePreview = null;
      }
    };
    reader.readAsDataURL(file);
  } // méthode permettant de créer un objet file correspondant à l'image téléchargée

  ngOnDestroy() {
    this.subscriptionGetCategories.unsubscribe();
    this.subscriptionEditCategory.unsubscribe();
  }

}
