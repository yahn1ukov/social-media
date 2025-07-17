import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMatch', async: false })
export class IsMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, string>)[relatedProperty];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints as [string];
    return `${args.property} must match ${relatedProperty}`;
  }
}

export function IsMatch(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsMatchConstraint,
    });
  };
}
