import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
    admin     = 'admin',
    user      = 'user',
    superUser = 'super-user'
}

registerEnumType( ValidRoles, { name: 'validRoles', description: 'The "UserRoles" enumeration defines three levels of access and privileges within a system: "admin," which grants the highest level of access and full control over the system; "superUser," which provides advanced rights without the complete system management capabilities of an admin; and "user," which assigns standard access level allowing basic interactions without access to administrative functions or advanced settings.' } );