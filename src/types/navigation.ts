import type {
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import {User} from './user';

export type RootStackParamList = {
  Home: undefined;
  Call: {user: User; sessionName: string};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type ScreenProps = StackNavigationProp<RootStackParamList>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
