// SDComponent.js
import React from 'react';

import SDProperties from './SDProperties';
import SDComponentType from '../../enums/SDComponentType';

class SDComponent {
    constructor(id = '', componentType = '', properties  = {}, childrens = [], states = []) {
        this.id = id;
        this.componentType = SDComponentType[componentType];
        this.properties = properties;
        this.childrens = childrens;
        this.states = Array.isArray(states) ? states : [];
    }

    toJSON() {
        return {
            id: this.id,
            componentType: this.componentType,
            properties: this.properties && typeof this.properties.toJSON === 'function' ? this.properties.toJSON() : null, // Verificación agregada aquí
            childrens: Array.isArray(this.childrens) ? this.childrens.map(child => child ? child.toJSON() : null) : [],
            states: this.states,
            order: this.order
        };
    }

    static fromJSON(json) {
        const component = Object.create(SDComponent.prototype);

        const childrens = Array.isArray(json.childrens) ? json.childrens.map(childJson => childJson ? SDComponent.fromJSON(childJson) : null) : [];

        const states = Array.isArray(json.states) ? json.states : [];

        Object.assign(component, json, {
            properties: json.properties ? SDProperties.fromJSON(json.properties) : null,
            childrens: childrens,
            states: states
        });

        return component;
    }
}

export default SDComponent;
