import { useDrag } from 'react-dnd';
import SDComponentType from '../../enums/SDComponentType';

const tipoItem = {
    COMPONENTE: 'componente'
}

const Componente = ({ type, children }) => {
    const [{isDragging}, drag] = useDrag({
        type: tipoItem.COMPONENTE,
        item: { type },
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
            <Componente type={SDComponentType.VStack}>VStack</Componente>
            <Componente type={SDComponentType.HStack}>HStack</Componente>
            <Componente type={SDComponentType.ZStack}>ZStack</Componente>
            <Componente type={SDComponentType.Text}>Text</Componente>
            <Componente type={SDComponentType.Button}>Button</Componente>
            <Componente type={SDComponentType.Image}>Image</Componente>
            <Componente type={SDComponentType.TextField}>TextField</Componente>
            <Componente type={SDComponentType.ScrollView}>ScrollView</Componente>
        </>
    )
}

export {Componentes, tipoItem};
