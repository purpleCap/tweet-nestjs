import { SetMetadata } from "@nestjs/common"

export const AllowAnonymous = () => {
    // return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    //     console.log('The allow anonumous func is called. '+ propertyKey)
    // }

    return SetMetadata('isPublic', true);
}