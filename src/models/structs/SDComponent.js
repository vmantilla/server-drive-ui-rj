// SDComponent.js
import React from 'react';

import SDProperties from './SDProperties';
import SDComponentType from '../../enums/SDComponentType';

class SDComponent {
    constructor(id, componentType, properties, childrens, states, order) {
        this.id = id;
        this.componentType = SDComponentType[componentType];
        this.properties = properties;
        this.childrens = childrens;
        this.states = states;
        this.order = order;
    }

    toJSON() {
        return {
            id: this.id,
            componentType: this.componentType,
            properties: this.properties ? this.properties.toJSON() : null, // Si properties es null o undefined, asigna null
            childrens: Array.isArray(this.childrens) ? this.childrens.map(child => child ? child.toJSON() : null) : [], // Si childrens no es una matriz, asigna una matriz vacía
            states: this.states,
            order: this.order
        };
    }

    static fromJSON(json) {
        const component = Object.create(SDComponent.prototype);

        // Cuando reasignamos properties y childrens, aseguramos de que estén en el formato correcto.
        const childrens = Array.isArray(json.childrens) ? json.childrens.map(childJson => childJson ? SDComponent.fromJSON(childJson) : null) : [];

        Object.assign(component, json, {
            properties: json.properties ? SDProperties.fromJSON(json.properties) : null, // Si properties es null o undefined, asigna null
            childrens: childrens // Usamos map para llamar a fromJSON en cada hijo.
        });

        return component;
    }

}

export default SDComponent;
