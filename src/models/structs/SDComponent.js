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
            properties: this.properties.toJSON(), // Asumimos que properties es una instancia de SDProperties o una clase similar.
            childrens: this.childrens.map(child => child.toJSON()), // Usamos map para llamar a toJSON en cada hijo.
            states: this.states,
            order: this.order
        };
    }

    static fromJSON(json) {
        const component = Object.create(SDComponent.prototype);

        // Cuando reasignamos properties y childrens, aseguramos de que estén en el formato correcto.
        const childrens = json.childrens ? json.childrens.map(childJson => SDComponent.fromJSON(childJson)) : [];

        Object.assign(component, json, {
            properties: SDProperties.fromJSON(json.properties), // Asumimos que SDProperties tiene un método estático fromJSON.
            childrens: childrens // Usamos map para llamar a fromJSON en cada hijo.
        });

        return component;
    }
}

export default SDComponent;
