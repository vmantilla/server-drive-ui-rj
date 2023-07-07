class SDCornerRadius {
    constructor(cornerRadius) {
        this.shape = cornerRadius.shape;
        this.corners = cornerRadius.corners;
    }

    cornerRadiusValue(frame) {

        let corners = this.corners;
        let shape = this.shape;

        let defaultRadius;
        switch (shape) {
            case "none":
                defaultRadius = 0;
                break;
            case "extraSmall":
                defaultRadius = 5;
                break;
            case "small":
                defaultRadius = 10;
                break;
            case "medium":
                defaultRadius = 20;
                break;
            case "large":
                defaultRadius = 30;
                break;
            case "extraLarge":
                defaultRadius = 40;
                break;
            case "full":
                defaultRadius = (frame?.height ?? 0) * 0.5;
                break;
            default:
                defaultRadius = 0;
                break;
        }

        return `${corners?.topStart ?? defaultRadius}px ${corners?.topEnd ?? defaultRadius}px ${corners?.bottomEnd ?? defaultRadius}px ${corners?.bottomStart ?? defaultRadius}px`;

    }
}

export default SDCornerRadius;