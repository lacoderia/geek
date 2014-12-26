'use strict';

Geek.factory('SessionService', [function(){

    var session = {
        id: undefined,
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        gender: undefined,
        phone_number: undefined,
        picture_url: undefined
    };

    var createSession = function(id, email, firstName, lastName, gender, phoneNumber, pictureUrl){
        session = {
            id: id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            phone_number: phoneNumber,
            picture_url: pictureUrl
        };
    };

    var getId = function(){
        return session.id;
    };

    var setId = function(id){
        session.id = id;
    };

    var getEmail = function(){
        return session.email;
    };

    var setEmail = function(email){
        session.email = email;
    };

    var getFirstName = function(){
        return session.first_name;
    };

    var setFirstName = function(firstName){
        session.first_name = firstName;
    };

    var getLastName = function(){
        return session.last_name;
    };

    var setLastName = function(lastName){
        session.last_name = lastName;
    };

    var getGender = function(){
        return session.gender;
    };

    var setGender = function(gender){
        session.gender = gender;
    };

    var getPhoneNumber = function(){
        return session.phone_number;
    };

    var setPhoneNumber = function(phoneNumber){
        session.phone_number = phoneNumber;
    };

    var getPictureUrl = function(){
        return session.picture_url;
    };

    var setPictureUrl = function(pictureUrl){
        session.picture_url = pictureUrl;
    };

    var destroySession = function(){
        session = undefined;
    };

    var getSession = function(){
        return session;
    };

    return {
        getSession: getSession,
        createSession: createSession,
        destroySession: destroySession,
        getId: getId,
        setId: setId,
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
        setPictureUrl: setPictureUrl

    }

}]);
