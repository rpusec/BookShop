# BookStop #

This is a simple online book shop application I've built to familiarize myself with AngularJS. The backend is written in pure PHP and the visuals are built with Bootstrap.  

Based on the provided phpMyAdmin dump, all of the users' passwords are `testing123`. 

### Requirements ###
 * PHP 5 >= 5.5.0 or PHP 7 (mostly because of password_confirm/verify functions)
 * The repository comes with a phpMyAdmin dump of the database, which is an SQL script that has to be run prior to running the application. 

### Dependencies used in the project ###
 * [JQuery](https://jquery.com/)
 * [AngularJS](https://www.angularjs.org/)
 * [Bootstrap](http://getbootstrap.com/)
 * [UI-Router](https://github.com/angular-ui/ui-router) - to handle page-load without refreshes. 
 * [UI-Bootstrap](https://angular-ui.github.io/bootstrap/) - set of native AngularJS directives with Bootstrap's markup and CSS.
 * [Notify.js](https://notifyjs.com/) - to provide stylized notifications.
 * [ngAnimate](https://docs.angularjs.org/api/ngAnimate) - to provide animations.

### Directory tree ###
```
+--app/  
|  +--backend/  
|  |  +--config/  
|  |  |  +--appconfig.php  
|  |  |  +--dbconfig.php  
|  |  +--controller/  
|  |  |  +--bookcontr.php  
|  |  |  +--usercontr.php  
|  |  +--dbutil/  
|  |  |  +--basedb.php  
|  |  |  +--bookdb.php  
|  |  |  +--userdb.php  
|  |  +--logic/  
|  |  |  +--authbusiness.php  
|  |  |  +--bookbusiness.php  
|  |  +--validation/  
|  |  |  +--validation.php  
|  |  |  +--ValidationHelper.class.php  
|  |  +--view/  
|  |  |  +--bookview.php  
|  |  |  +--userview.php  
|  +--frontend/  
|  |  +--controller/  
|  |  |  +--accSettingsContr.js  
|  |  |  +--adminContr.js  
|  |  |  +--app.js  
|  |  |  +--bookContr.js  
|  |  |  +--cartContr.js  
|  |  |  +--catalogueContr.js  
|  |  |  +--entityModalContr.js  
|  |  |  +--loginContr.js  
|  |  |  +--navbarContr.js  
|  |  |  +--userContr.js  
|  |  +--css/  
|  |  |  +--bootstrap-glyphicons.css  
|  |  |  +--bootstrap.min.css  
|  |  +--directives/  
|  |  |  +--app.js  
|  |  |  +--bookCover.js  
|  |  |  +--currentBalance.js  
|  |  |  +--highlightKeywords.js  
|  |  |  +--resultsFound.js  
|  |  |  +--searchOptions.js  
|  |  +--fonts/  
|  |  |  +--glyphiconshalflings-regular.eot  
|  |  |  +--glyphiconshalflings-regular.svg  
|  |  |  +--glyphiconshalflings-regular.ttf  
|  |  |  +--glyphiconshalflings-regular.woff  
|  |  |  +--glyphiconshalflings-regular.woff2  
|  |  +--includes/  
|  |  |  +--dirtemps/  
|  |  |  |  +--searchOptions.html  
|  |  |  +--footer.html  
|  |  |  +--modals/  
|  |  |  |  +--bookCopiesModal.html  
|  |  |  |  +--bookModal.html  
|  |  |  |  +--userModal.html  
|  |  |  +--navbar.html  
|  |  |  +--pages/  
|  |  |  |  +--accsettings.html  
|  |  |  |  +--admin.html  
|  |  |  |  +--books.html  
|  |  |  |  +--cart.html  
|  |  |  |  +--catalogue.html  
|  |  |  |  +--login.html  
|  |  |  |  +--users.html  
|  |  +--js/  
|  |  |  +--angular-animate.min.js  
|  |  |  +--angular-ui-router.min.js  
|  |  |  +--angular.min.js  
|  |  |  +--bootstrap.min.js  
|  |  |  +--jquery-1.12.4.min.js  
|  |  |  +--notify.js  
|  |  |  +--ui-bootstrap-tpls-1.3.3.min.js  
|  |  +--services/  
|  |  |  +--app.js  
|  |  |  +--authService.js  
|  |  |  +--bookService.js  
|  |  |  +--cartService.js  
|  |  |  +--catalogueService.js  
|  |  |  +--userService.js  
```

### Screenshots ###

![shot1](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot1.png)  

![shot2](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot2.png)  

![shot3](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot3.png)  

![shot4](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot4.png)  

![shot5](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot5.png) 

![shot6](https://raw.githubusercontent.com/rpusec/BookShop/master/screenshots/shot6.png)  

### Documentation ###

Each controller, directive, and service is documented with JSDoc-style documentaiton.
