import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsNotMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'IsNotMatch',
      target: target.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsNotMatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsNotMatch' })
export class IsNotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];

    return (
      typeof value === 'string' &&
      typeof relatedValue === 'string' &&
      value !== relatedValue
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    return `${args.property} should not match ${relatedPropertyName}`;
  }
}
