import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUsernameOrEmail', async: false })
export class IsUsernameOrEmailConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return usernameRegex.test(value) || emailRegex.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid username or email`;
  }
}

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameOrEmailConstraint,
    });
  };
}
