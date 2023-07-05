// SDComponent.js
import React from 'react';
import SDComponentType from '../../enums/SDComponentType';

class SDComponent {
    constructor(id, type, properties, childrens, states) {
        this.id = id;
        this.type = SDComponentType[type];
        this.properties = properties;
        this.childrens = childrens;
        this.states = states;
    }
}

export default SDComponent;
