import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotMatch', async: false })
export class IsNotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, string>)[
      relatedProperty
    ];

    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints as [string];
    return `${args.property} must not match ${relatedProperty}`;
  }
}

export function IsNotMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNotMatchConstraint,
    });
  };
}
