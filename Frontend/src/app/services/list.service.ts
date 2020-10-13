import { Injectable } from '@angular/core';
import { List } from '../models/list.model';
import { spot } from '../models/list.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  lists: List[] = [];
  hostAdress = 'http://localhost:4000/api/list';
  constructor(private http: HttpClient) { }

  getLists(id: any) {
    return this.http.get('http://localhost:4000/api/lists' + '/' + id, {observe: 'response'});
  } // méthode permettant de récupérer le tableau de taches

  getList(id: any) {
    return this.http.get(this.hostAdress + '/' + id, {observe: 'response'});
  } // méthode permettant de récupérer une tache de la base de données

  addList(list: List) {
    return this.http.post(this.hostAdress, list, {observe: 'response'});
  } // méthode permettant d'ajouter une catégorie au tableau de taches

  deleteList(id: any) {
    return this.http.delete(this.hostAdress + '/' + id);
  } // méthode permettant de supprimer une tache du tableau de taches

  editList(id: any, list: List) {
    return this.http.put(this.hostAdress + '/' + id, list, {observe: 'response'});
  } // méthode permettant de modifier une tache dans le tableau de taches

  changeToDoneList(list: List) {
    const index = list['id'];
    list.IsDone = true;
    list.Percent = 100;
    list.IsLate = 'réalisée';
    list.DateFinExact = this.getDateFinExact(list.Percent);
    return this.editList(index, list);
  } // méthode permettant de rendre la tache à réaliser une tache réalisée

  changeToLateList(list: List) {
    const index = this.lists.indexOf(list);
    const oneList = this.lists[index];
    oneList.IsLate = this.getIsLate(new Date(oneList.DateDebut), new Date(oneList.DateFin), oneList.Percent, oneList.Type);
    this.lists.splice(index, 1, oneList);
  }

  getDateFinExact(percent) {
    let dateFinReal: Date;
    if (percent >= 100) {
      dateFinReal = new Date();
    } else {
      dateFinReal = undefined;
    }
    return dateFinReal;
  }

  getIsLate(dateDebut: Date, dateFin: Date, percent: number, type: string) {
    const actualDate: Date = new Date();
    const dates = this.getIntermediateDates(dateDebut, dateFin);
    const date2 = dates[1];
    const date3 = dates[2];
    const date4 = dates[3];
    const date5 = dates[4];
    if (type === spot['0']) {
      if (percent >= 100) {
        return 'réalisée';
      } else {
        if (actualDate <= dateFin) {
          return 'en avance';
        } else if (actualDate > dateFin) {
          return 'en retard';
        }
      }
    } else if (type === spot['1']) {
      if ((percent >= 100)) {
        return 'réalisée';
      } else if ((actualDate <= date2) && (percent <= 25)) {
        return 'en avance';
      } else if ((actualDate <= date2) && (percent > 25)) {
        return 'réalisée';
      } else if ((actualDate > date2) && (actualDate <= date3) && (percent <= 25)) {
        return 'en retard';
      } else if ((actualDate > date2) && (actualDate <= date3) && (percent > 25) && (percent < 50)) {
        return 'en avance';
      } else if ((actualDate > date2) && (actualDate <= date3) && (percent >= 50)) {
        return 'réalisée';
      } else if ((actualDate > date3) && (actualDate <= date4) && (percent <= 50)) {
        return 'en retard';
      } else if ((actualDate > date3) && (actualDate <= date4) && (percent > 50) && (percent < 75)) {
        return 'en avance';
      } else if ((actualDate > date3) && (actualDate <= date4) && (percent >= 75)) {
        return 'réalisée';
      } else if ((actualDate > date4) && (actualDate <= date5) && (percent <= 75)) {
        return 'en retard';
      } else if ((actualDate > date4) && (actualDate <= date5) && (percent > 75) && (percent < 100)) {
        return 'en avance';
      } else if ((actualDate > date4) && (actualDate <= date5) && (percent >= 100)) {
        return 'réalisée';
      } else if ((actualDate > date5) && (percent < 100)) {
        return 'en retard';
      }
    }
  }

  dateDiff(date1, date2) {
    const tmp1 = date2 - date1;

    const tmp2 = Math.floor(tmp1 / 1000);             // Nombre de secondes entre les 2 dates
    const sec = tmp2 % 60;                    // Extraction du nombre de secondes

    const tmp3 = Math.floor((tmp2 - sec) / 60);    // Nombre de minutes (partie entière)
    const min = tmp3 % 60;                    // Extraction du nombre de minutes

    const tmp4 = Math.floor((tmp3 - min) / 60);    // Nombre d'heures (entières)
    const hour = tmp4 % 24;                   // Extraction du nombre d'heures

    const tmp5 = Math.floor((tmp4 - hour) / 24);   // Nombre de jours restants
    const day = tmp5;

    return day;
  }

  getIntermediateDates(dateDebut: Date, dateFin: Date) {
    const totalDays = this.dateDiff(dateDebut, dateFin);
    const days = Math.floor(totalDays / 4);
    const dates = [dateDebut];
    let date = dateDebut;
    for (let i = 0; i < 3; i++) {
      date = this.getDate(date, days);
      dates.push(new Date(date));
    }
    dates.push(dateFin);
    return dates;
  }

  getDate(date, days) {
    date.setDate(date.getDate() + days);
    return date;
  }

  changeFormatDate(date: any) {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    return new Date(year, month - 1, day);
  }

}
