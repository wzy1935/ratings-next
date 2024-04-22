import { notifications } from '@mantine/notifications';

const n = {
  log(content: string, title?: string) {
    notifications.show({
      title: title,
      message: content,
    });
  },
  error(content: string, title?: string) {
    notifications.show({
      title: title,
      message: content,
      color: 'red',
    });
  },
  success(content: string, title?: string) {
    notifications.show({
      title: title,
      message: content,
      color: 'green',
    });
  },
};

export default n;
