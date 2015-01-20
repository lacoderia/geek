'use strict';

Geek.factory('SessionService', [function(){

    var session = {
        id: undefined,
        balanceInfo: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        gender: undefined,
        phoneNumber: undefined,
        picture: undefined,
        pictureUrl: undefined,
        preference: undefined,
        references: undefined,
        request: undefined,
        background: undefined,
        topics: undefined,
        zones: undefined

    };

    var createSession = function(id, balanceInfo, email, firstName, lastName, gender, phoneNumber, details, picture, pictureUrl, preference, references, request, background, topics, zones){
        this.setId(id);
        this.setBalanceInfo(balanceInfo);
        this.setEmail(email);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setGender(gender);
        this.setPhoneNumber(phoneNumber);
        this.setPicture(picture);
        this.setPictureUrl(pictureUrl);
        this.setPreference(preference);
        this.setReferences(references);
        this.setRequest(request);
        this.setBackground(background);
        this.setTopics(topics);
        this.setZones(zones);
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
        return session.phone_number;
    };

    var setPhoneNumber = function(phoneNumber){
        session.phoneNumber = phoneNumber;
    };

    var getDetails = function(){
        return session.details;
    };

    var setDetails = function(details){
        session.details = details;
    }

    var getPicture = function(){
        return session.picture;
    };

    var setPicture = function(picture){
        session.picture = picture;
    };

    var getPictureUrl = function(){
        return session.pictureUrl;
    };

    var setPictureUrl = function(pictureUrl){
        session.pictureUrl = pictureUrl;
    };

    var getTopics = function(){
        return session.topics;
    };

    var setTopics = function(topics){
        session.topics = topics;
    };

    var getBalanceInfo = function(){
        return session.balanceInfo;
    };

    var setBalanceInfo = function(balanceInfo){
        session.balanceInfo = balanceInfo;
    };

    var getPreference = function(){
        return session.preference;
    };

    var setPreference = function(preference){
        session.preference = {
            'cost': preference.cost,
                'classLocation': {
                'online': preference.online,
                    'office': preference.office,
                    'public': preference.public,
                    'studentPlace': preference.student_place
            },
            'availabilities': preference.availabilities
        }
    };

    var getReferences = function(){
        return session.references;
    };

    var setReferences = function(references){
        session.references = references;
    };

    var getRequest = function(){
        return session.request;
    };

    var setRequest = function(request){
        session.request = request;
    };

    var getBackground = function(){
        return session.background;
    };

    var setBackground = function(background){
        session.background = background;
    };

    var getZones = function(){
        return session.zones;
    };

    var setZones = function(zones){
        session.zones = zones;
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
        getPicture: getPicture,
        setPicture: setPicture,
        getPictureUrl: getPictureUrl,
        setPictureUrl: setPictureUrl,
        getTopics: getTopics,
        setTopics: setTopics,
        getBalanceInfo: getBalanceInfo,
        setBalanceInfo: setBalanceInfo,
        getPreference: getPreference,
        setPreference: setPreference,
        getReferences: getReferences,
        setReferences: setReferences,
        getRequest: getRequest,
        setRequest: setRequest,
        getBackground: getBackground,
        setBackground: setBackground,
        getZones: getZones,
        setZones: setZones
    }

}]);
