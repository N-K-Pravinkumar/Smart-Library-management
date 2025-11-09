import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Register } from './modules/auth/register/register';
import { Layout } from './shared/layout/layout';




import { Book  as librarianBook} from './modules/admin/book/book';
import { Home as librarianHome } from './modules/admin/home/home';
import { Booktransaction as librarianTransaction } from './modules/admin/booktransaction/booktransaction';
import { Reports as librarianReports} from './modules/admin/reports/reports';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'librarian',
    component: Layout,
    children: [
      { path: 'home', component: librarianHome },
      { path: 'book', component: librarianBook },
      { path: 'transaction', component: librarianTransaction },
      { path: 'reports', component: librarianReports },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

//   {
//     path: 'student',
//     component: Layout,
//     children: [
//       { path: 'home', component: StudentHome },
//       { path: 'book', component: StudentBook },
//       { path: 'transaction', component: StudentTransaction },
//       { path: 'reports', component: StudentReports },
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//     ],
//   },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
