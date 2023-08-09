import { useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import SDComponentType from '../../enums/SDComponentType';

const tipoItem = {
    COMPONENTE: 'componente'
}

const Componente = ({ type, children }) => {
    const [{isDragging}, drag] = useDrag({
        type: tipoItem.COMPONENTE,
        item: { id: uuidv4(), type },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            {children}
        </div>
    )
}

const Componentes = () => {
    return (
        <>
            <Componente type={SDComponentType.ContainerView}>ContainerView</Componente>
            <Componente type={SDComponentType.ScrollView}>ScrollView</Componente>
            <Componente type={SDComponentType.Button}>Button</Componente>
            <Componente type={SDComponentType.Object}>Object</Componente>
            <Componente type={SDComponentType.Space}>Space</Componente>
        </>
    )
}

export {Componentes, tipoItem};
