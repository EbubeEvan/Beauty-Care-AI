import { Label } from '@/components/ui/label';
import { SelectProps } from '@radix-ui/react-select';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ExtendedSelectProps extends SelectProps {
  /** @description  This is the list of options for the select component. It must be a array of object.
   *  @example{name:'',value:''} */
  options: any[];
  /** @description  This is the key name for the value of the option.
   *  @example 'value' */
  optionValue?: string;
  /** @description  This is the key name for the title of the option. This is the human readable text.
   *  @example 'name'  */
  optionTitle?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  className?: string;
}
export function SelectItems({
  options,
  optionTitle = 'name',
  optionValue = 'value',
  label,
  placeholder,
  helperText,
  value,
  className,
  error,
  ...otherProps
}: Readonly<ExtendedSelectProps>) {
  return (
    <section
      className={cn(
        'relative flex w-full flex-1 flex-col gap-[6px] space-y-0',
        className,
      )}
    >
      {label && (
        <Label>
          {label}
        </Label>
      )}
      <Select {...otherProps} value={value?.toString()}>
        <SelectTrigger
          className={cn('w-full', {
            '[&>span]:text-input': !value,
            '[&>span]:text-label': !!value,
            'border-2 border-destructive': error,
          })}
        >
          <SelectValue className="text-input" placeholder={placeholder ?? ''} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option, index: number) => (
            <SelectItem
              value={option?.[optionValue]?.toString()}
              key={index}
            >
              {option?.[optionTitle]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p
          className='text-red-700 text-sm text-left'
        >
          {helperText}
        </p>
      )}
    </section>
  );
}
