'use strict';

Geek.factory('SessionService', [function(){

    var session = {
        id: undefined,
        active: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        gender: undefined,
        phoneNumber: undefined,
        pictureUrl: undefined,
        hasCard: undefined,
        tempTutorId: undefined
    };

    var createSession = function(id, active, email, firstName, lastName, gender, phoneNumber, pictureUrl, hasCard, tempTutorId){
        this.setId(id);
        this.setActive(active);
        this.setEmail(email);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setGender(gender);
        this.setPhoneNumber(phoneNumber);
        this.setPictureUrl(pictureUrl);
        this.setHasCard(hasCard);
        this.setTempTutorId(tempTutorId);
    };

    var getId = function(){
        return session.id;
    };

    var setId = function(id){
        session.id = id;
    };

    var getActive = function(){
        return session.active;
    };

    var setActive = function(active){
        session.active = active;
    };

    var getEmail = function(){
        return session.email;
    };

    var setEmail = function(email){
        session.email = email;
    };

    var getFirstName = function(){
        return session.firstName;
    };

    var setFirstName = function(firstName){
        session.firstName = firstName;
    };

    var getLastName = function(){
        return session.lastName;
    };

    var setLastName = function(lastName){
        session.lastName = lastName;
    };

    var getGender = function(){
        return session.gender;
    };

    var setGender = function(gender){
        session.gender = gender;
    };

    var getPhoneNumber = function(){
        return session.phoneNumber;
    };

    var setPhoneNumber = function(phoneNumber){
        session.phoneNumber = phoneNumber;
    };

    var getPictureUrl = function(){
        return session.pictureUrl;
    };

    var setPictureUrl = function(pictureUrl){
        session.pictureUrl = pictureUrl;
    };

    var getHasCard = function(){
        return session.hasCard;
    };

    var setHasCard = function(hasCard){
        session.hasCard = hasCard;
    };

    var getTempTutorId = function () {
        return session.setTempTutorId;
    };

    var setTempTutorId = function (tempTutorId) {
        session.setTempTutorId = tempTutorId;
    };

    var destroySession = function(){
        session = undefined;
    };

    var getSession = function(){
        return angular.copy(session);
    };

    return {
        getSession: getSession,
        createSession: createSession,
        destroySession: destroySession,
        getId: getId,
        setId: setId,
        getActive: getActive,
        setActive: setActive,
        getEmail: getEmail,
        setEmail: setEmail,
        getFirstName: getFirstName,
        setFirstName: setFirstName,
        getLastName: getLastName,
        setLastName: setLastName,
        getGender: getGender,
        setGender: setGender,
        getPhoneNumber: getPhoneNumber,
        setPhoneNumber: setPhoneNumber,
        getPictureUrl: getPictureUrl,
        setPictureUrl: setPictureUrl,
        getHasCard: getHasCard,
        setHasCard: setHasCard,
        getTempTutorId: getTempTutorId,
        setTempTutorId: setTempTutorId
    }

}]);
