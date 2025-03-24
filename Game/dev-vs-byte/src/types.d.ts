// Type definitions for Telegram Web App
interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      initData: string;
      initDataUnsafe: {
        query_id: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
        };
        auth_date: string;
        hash: string;
      };
      colorScheme: 'light' | 'dark';
      themeParams: {
        bg_color: string;
        text_color: string;
        hint_color: string;
        link_color: string;
        button_color: string;
        button_text_color: string;
        secondary_bg_color: string;
      };
      showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
          id?: string;
          type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
          text: string;
        }>;
      }, callback?: (buttonId: string) => void) => void;
      showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
      showAlert: (message: string, callback?: () => void) => void;
    };
  };
}
