import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ListService } from 'src/app/services/list.service';
import { AddListComponent } from '../add-list/add-list.component';
import { DeleteListComponent } from '../delete-list/delete-list.component';
import { EditListComponent } from '../edit-list/edit-list.component';
import { DetailsListComponent } from '../details-list/details-list.component';
import { List } from 'src/app/models/list.model';
import { CategoryService } from 'src/app/services/category.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, AfterViewInit, OnDestroy {
  length: number; // nombre de ligne  du tableau
  pageSize = 4; // nombre de ligne maximal par page
  displayedColumns: string[] = ['Checkbox', 'Nom', 'Type', 'Category', 'DateDebut',
    'DateFin', 'Percent', 'IsLate', 'Action']; // les colonnes du tableau
  dataSource = new MatTableDataSource([]); // Data du tableau

  private paginator: MatPaginator;
  private sort: any;
  getCategorySubscribing: Subscription;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  } // pagination
  @ViewChild(MatSort, { static: false }) set content(content: ElementRef) {
    this.sort = content;
    this.dataSource.sort = this.sort;
  } // tri
  getListSubscribing: Subscription;

  constructor(private listService: ListService,
              private matDialog: MatDialog,
              private categoryService: CategoryService,
              private authentificationService: AuthentificationService) {
  }

  functionToMaintainCheckedList(list) {
    this.listService.changeToDoneList(list).subscribe((data) => {
      console.log(data);
      setTimeout(() => {
        this.updateData();
      }, 2000);
    },
      (err) => {
        console.log(err);
      });
  }


  ngOnInit(): void {
    this.updateData();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSize;
    });
  }

  updateData() {
    this.getListSubscribing = this.listService.getLists(this.authentificationService.id).subscribe((data) => {
      const lists = ((data.body) as any).Data;
      const newLists: List[] = [];
      for (let i = 0; i < lists.length; i++) {
        this.getCategorySubscribing = this.categoryService.getCategory(lists[i].idCategory).subscribe((info) => {
          if (((info.body) as any).Data !== null) {
            lists[i]['Category'] = ((info.body) as any).Data.Nom;
          }
          lists[i]['Action'] = i;
          delete lists[i].idCategory;
        },
          (err) => {
            console.log(err);
          });
        // tslint:disable-next-line: no-string-literal
        if (lists[i].IsDone === false) {
          // ajout de l'espace entre les deux boutons
          newLists.push(lists[i]);
        }
      }
      this.length = newLists.length;
      this.dataSource = new MatTableDataSource(newLists); // Remplissage du tableau par les données
      this.dataSource.paginator = this.paginator; // mise à jour de la pagination
      this.dataSource.sort = this.sort; // mise à jour de tri
    },
      (err) => {
        console.log('erreur est la suivante: ', err);
      });
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
      dialogConfig.width = '60%';
    }
  } // méthode permettant d'ouvrir une fentre popup dans la page

  addList() {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    const dialogRef = this.matDialog.open(AddListComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          if (data.action === 1) {
            this.updateData();  // mise à jour de la base de données
            this.dataSource.paginator = this.paginator; // mise à jour de la pagination
            this.dataSource.sort = this.sort; // mise à jour de tri
          }
        }
      }
    ); // exécuter la fonction callback après la fermeture de la fenetre popup
  } // méthode permettant d'ouvrir le composant AddList et d'ajouter la tache à la liste après la ferméture de fenetre popup

  deleteList(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = { data: elem.id };
    const dialogRef = this.matDialog.open(DeleteListComponent, dialogConfig);
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
  } // méthode permettant d'ouvrir le composant DeleteList
  // et de supprimer une tache après la fermétrure de fenetre popup

  editList(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = { data: elem.id };
    const dialogRef = this.matDialog.open(EditListComponent, dialogConfig);
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
  } // méthode permettant d'ouvrir le composant EditList
  // et d'éditer une tache après la fermétrure de fenetre popup

  detailsList(elem) {
    const dialogConfig = new MatDialogConfig();
    this.openModal(dialogConfig);
    dialogConfig.data = { data: elem.id, info: 'todoList' };
    dialogConfig.height = '90%';
    const dialogRef = this.matDialog.open(DetailsListComponent, dialogConfig);
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
  } // méthode permettant d'ouvrir le composant DetailsList
  // et d'afficher les détails de la tache après la fermétrure de fenetre popup

  ngOnDestroy() {
     this.getListSubscribing.unsubscribe();
     this.getCategorySubscribing.unsubscribe();
  }
}
