import { Toast as ArkToast } from '@ark-ui/react';
import { styled, type HTMLStyledProps } from '../../../styled-system/jsx';
import { toast } from '../../../styled-system/recipes';
import { createStyleContext } from '../../lib/create-style-context';

const { withProvider, withContext } = createStyleContext(toast);

const Toast = withProvider(styled(ArkToast.Root), 'root');
const ToastCloseTrigger = withContext(styled(ArkToast.CloseTrigger), 'closeTrigger');
const ToastDescription = withContext(styled(ArkToast.Description), 'description');
const ToastTitle = withContext(styled(ArkToast.Title), 'title');

const Root = Toast;
const CloseTrigger = ToastCloseTrigger;
const Description = ToastDescription;
const Title = ToastTitle;

export { CloseTrigger, Description, Root, Title, Toast, ToastCloseTrigger, ToastDescription, ToastTitle };

export interface ToastProps extends HTMLStyledProps<typeof Toast> {}
export interface ToastCloseTriggerProps extends HTMLStyledProps<typeof ToastCloseTrigger> {}
export interface ToastDescriptionProps extends HTMLStyledProps<typeof ToastDescription> {}
export interface ToastTitleProps extends HTMLStyledProps<typeof ToastTitle> {}
