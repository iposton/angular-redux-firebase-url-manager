import angular from 'angular';
import SaveBookmarksModule from './save-bookmark/save-bookmark';
import { BookmarksActions } from './bookmarks.state' 

import template from './bookmarks.html';
import './bookmarks.css';
import database from '../../database';

class BookmarksController {
  constructor($ngRedux, BookmarksActions) {
    'ngInject';

    this.store = $ngRedux;
    this.BookmarksActions = BookmarksActions;
    
  }

  $onInit() {

   this.unsubscribe = this.store.connect(this.mapStateToThis, this.BookmarksActions)(this);
   this.getBookmarks();
    
  }

  $onDestroy() {
    this.unsubscribe();
  }

   mapStateToThis(state) {
        return {
            bookmarks: state.bookmarks,
            currentBookmark: state.bookmark,
            currentCategory: state.category
        }
    }



  onSave(bookmark) {
    this.getBookmarks();
    this.saveBookmark(bookmark);
    this.resetSelectedBookmark();
  }

 
}

const BookmarksComponent = {
  template,
  controller: BookmarksController,
  controllerAs: 'bookmarksListCtrl'
};

const BookmarksModule = angular.module('bookmarks', [
    SaveBookmarksModule.name
  ])
  .factory('BookmarksActions', BookmarksActions)
  .component('bookmarks', BookmarksComponent);

export default BookmarksModule;
