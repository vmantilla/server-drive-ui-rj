// SDComponent.js
import React from 'react';

import SDProperties from './SDProperties';
import SDComponentType from '../../enums/SDComponentType';

class SDComponent {
    constructor(id = '', component_type = '', properties  = {}, children = [], states = []) {
        this.id = id;
        this.component_type = SDComponentType[component_type];
        this.properties = properties;
        this.children = children;
        this.states = Array.isArray(states) ? states : [];
    }

    toJSON() {
        return {
            id: this.id,
            component_type: this.component_type,
            properties: this.properties && typeof this.properties.toJSON === 'function' ? this.properties.toJSON() : null, // Verificación agregada aquí
            children: Array.isArray(this.children) ? this.children.map(child => child ? child.toJSON() : null) : [],
            states: this.states,
            order: this.order
        };
    }

    static fromJSON(json) {
        const component = Object.create(SDComponent.prototype);

        const children = Array.isArray(json.children) ? json.children.map(childJson => childJson ? SDComponent.fromJSON(childJson) : null) : [];

        const states = Array.isArray(json.states) ? json.states : [];

        Object.assign(component, json, {
            properties: json.properties ? SDProperties.fromJSON(json.properties) : null,
            children: children,
            states: states
        });

        return component;
    }
}

export default SDComponent;
