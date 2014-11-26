'use strict';

Geek.factory('SessionService', [function(){

    var session = {
        id: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        gender: undefined,
        phone_number: undefined,
        details: undefined,
        picture_url: undefined,
        preference: undefined,
        references: undefined,
        request: undefined,
        studies: undefined,
        topics: undefined,
        zones: undefined
    };

    var createSession = function(id, email, firstName, lastName, gender, phoneNumber, details, pictureUrl, preference, references, request, studies, topics, zones){

        session = {
            id: id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            phone_number: phoneNumber,
            details: details,
            picture_url: pictureUrl,
            preference: preference,
            references: references,
            request: request,
            studies: studies,
            topics: topics,
            zones: zones
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

    var getDetails = function(){
        return session.details;
    }

    var setDetails = function(details){
      session.details =  details;
    };

    var getPictureUrl = function(){
        return session.picture_url;
    }

    var setPictureUrl = function(pictureUrl){
        session.picture_url =  pictureUrl;
    };

    var getPreference = function(){
        return session.preference;
    };

    var setPreference = function(preference){
        session.preference = preference;
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

    var getStudies = function(){
        return session.studies;
    };

    var setStudies = function(studies){
        session.studies = studies;
    };

    var getTopics = function(){
        return session.topics;
    };

    var setTopics = function(topics){
        session.topics = topics;
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
        getDetails: getDetails,
        setDetails: setDetails,
        getPictureUrl: getPictureUrl,
        setPictureUrl: setPictureUrl,
        getPreference: getPreference,
        setPreference: setPreference,
        getReferences: getReferences,
        setReferences: setReferences,
        getRequest: getRequest,
        setRequest: setRequest,
        getStudies: getStudies,
        setStudies: setStudies,
        getTopics: getTopics,
        setTopics: setTopics,
        getZones: getZones,
        setZones: setZones
    }

}]);
