import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { DetailsCategoryComponent } from '../details-category/details-category.component';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

  length: number; // nombre de ligne  du tableau
  pageSize = 4; // nombre de ligne maximal par page
  displayedColumns: string[] = ['Nom', 'Type', 'imageURL', 'Action']; // les colonnes du tableau
  dataSource = new MatTableDataSource([]); // Data du tableau

  private paginator: MatPaginator;
  private sort: any;
  subscriptionGetCategories: Subscription;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  } // pagination
  @ViewChild(MatSort, { static: false}) set content(content: ElementRef) {
    this.sort = content;
    this.dataSource.sort = this.sort;
  } // tri
  constructor(private categoryService: CategoryService,
              private matDialog: MatDialog,
              private authentificationService: AuthentificationService) {
    this.updateData();
  }

  updateData() {
    this.subscriptionGetCategories = this.categoryService.getCategories(this.authentificationService.id).subscribe((data) => {
      const categories = ((data.body) as any).Data;
      this.length = categories.length;
      for (let i = 0; i < categories.length; i++) {
        // tslint:disable-next-line: no-string-literal
        categories[i]['Action'] = i; // ajout de l'espace entre les deux boutons
      }
      this.dataSource = new MatTableDataSource(categories); // Remplissage du tableau par les données
      this.dataSource.paginator = this.paginator; // mise à jour de la pagination
      this.dataSource.sort = this.sort; // mise à jour de tri
    },
    (err) => {
      console.log('erreur est la suivante: ', err);
    });
  }

  ngOnInit(): void {
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  } // méthode permettant de filter le tableau lorsque le client écrit dans la barre de recherche

  openModal(dialogConfig: MatDialogConfig) {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (screen.width <= 600) {
      dialogConfig.width = '99%';
    } else {
      dialogConfig.width = '50%';
    }
    dialogConfig.maxHeight = '90vh';
  } // méthode permettant d'ouvrir une fentre popup dans la page

  addCategory() {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    const dialogRef = this.matDialog.open(AddCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          if (data.action === 1) {
            this.updateData(); // mise à jour de la base de données
            this.dataSource.paginator = this.paginator; // mise à jour de la pagination
            this.dataSource.sort = this.sort; // mise à jour de tri
          }
        }
      }
    ); // exécuter la fonction callback après la fermeture de la fenetre popup
  } // méthode permettant d'ouvrir le composant AddCategory et d'ajouter la catégorie à la liste après la ferméture de fenetre popup


  deleteCategory(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = {data: elem.id};
    const dialogRef = this.matDialog.open(DeleteCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          if (data.action === 1) {
            this.updateData(); // mise à jour de la base de données
            this.dataSource.paginator = this.paginator; // mise à jour de la pagination
            this.dataSource.sort = this.sort; // mise à jour de tri
          }
        }
      }
    ); // exécuter la fonction callback après la fermeture de la fenetre popup
  } // méthode permettant d'ouvrir le composant DeleteCategory et de supprimer la catégorie de la liste après la fermétrure de fenetre popup

  editCategory(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = {data: elem.id};
    const dialogRef = this.matDialog.open(EditCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          if (data.action === 1) {
            this.updateData(); // mise à jour de la base de données
            this.dataSource.paginator = this.paginator; // mise à jour de la pagination
            this.dataSource.sort = this.sort; // mise à jour de tri
          }
        }
      }
    ); // exécuter la fonction callback après la fermeture de la fenetre popup
  } // méthode permettant d'ouvrir le composant EditCategory et de modifier la catégorie après la fermétrure de fenetre popup

  detailsCategory(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = {data: elem.id};
    const dialogRef = this.matDialog.open(DetailsCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          if (data.action === 1) {
            this.updateData(); // mise à jour de la base de données
            this.dataSource.paginator = this.paginator; // mise à jour de la pagination
            this.dataSource.sort = this.sort; // mise à jour de tri
          }
        }
      }
    ); // exécuter la fonction callback après la fermeture de la fenetre popup
  } // méthode permettant d'ouvrir le composant DetailsCategory
    // et d'afficher les détails de la catégorie après la fermétrure de fenetre popup

    ngOnDestroy( ) {
      this.subscriptionGetCategories.unsubscribe();
    }
}
