import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App, View } from 'framework7-react';
import Preview from './Preview';
import { Tab, Tabs } from 'react-bootstrap';
import { Resizable } from "re-resizable";

const Builder = () => {
    return (
      <App>
        <View main>
          <div className="container-fluid" style={{height: '100vh'}}>
            <Tabs defaultActiveKey="components" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="components" title="Components">
                <div className="row" style={{border: '1px solid black', height: '33.33vh'}}>
                  <Resizable defaultSize={{width: '33.33%', height: '100%'}}>
                    <div className="col-12" style={{border: '1px solid red', height: '100%'}}>
                      {/* Aquí puedes listar tus componentes */}
                      <span>Listado de componentes</span>
                    </div>
                  </Resizable>
                  <Resizable defaultSize={{width: '33.33%', height: '100%'}}>
                    <div className="col-12" style={{border: '1px solid blue', height: '100%'}}>
                      {/* Aquí es donde los usuarios pueden arrastrar y soltar componentes */}
                      <span>Área de construcción de la interfaz de usuario</span>
                    </div>
                  </Resizable>
                  <Resizable defaultSize={{width: '33.33%', height: '100%'}}>
                    <div className="col-12" style={{border: '1px solid green', height: '100%'}}>
                      {/* Aquí se mostrarán y podrán ser editadas las propiedades del componente seleccionado */}
                      <span>Panel de propiedades del componente</span>
                    </div>
                  </Resizable>
                </div>
                <Resizable defaultSize={{width: '100%', height: '33.33%'}}>
                  <div className="row" style={{border: '1px solid yellow', height: '100%'}}>
                    <div className="col-12" style={{height: '100%'}}>
                      {/* Aquí puedes cambiar entre las diferentes vistas creadas */}
                      <span>Panel de vistas</span>
                    </div>
                  </div>
                </Resizable>
              </Tab>
              <Tab eventKey="colors_fonts" title="Colors & Fonts">
                <Resizable defaultSize={{width: '100%', height: '33.33%'}}>
                  <div className="row" style={{border: '1px solid purple', height: '100%'}}>
                    <div className="col-12" style={{height: '100%'}}>
                      {/* Aquí se pueden seleccionar colores y fuentes */}
                      <span>Panel de paleta de colores y fuentes</span>
                    </div>
                  </div>
                </Resizable>
              </Tab>
              <Tab eventKey="preview" title="Preview">
                <Resizable defaultSize={{width: '100%', height: '100vh'}}>
                  <div style={{border: '1px solid orange', height: '100%'}}>
                    <Preview />
                  </div>
                </Resizable>
              </Tab>
            </Tabs>
          </div>
        </View>
      </App>
    );
}

export default Builder;
