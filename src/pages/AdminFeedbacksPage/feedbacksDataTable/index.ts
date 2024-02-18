import { $t } from '@/scripts/$t';
import { apiFeedbacks } from '@/api';
import { asDateTime } from '@/utils';
import type { Feedback } from '@/types';
import getFeedbacksDataTable from './FeedbacksDataTable.pug';
import { onActionAdd } from '../PopupFeedback';
import { onActionEdit } from '../PopupFeedback';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import { TranslateManager } from '@/classes/TranslateManager';

enum TableColumn {
  Id = 'id',
  Actions = 'actions',
  CreatedAt = 'createdAt',
  Customer = 'customer',
  Rating = 'rating',
  Status = 'status',
  UpdatedAt = 'updatedAt',
  UpdatedByUserId = 'updatedByUserId',
}

interface Row {
  readonly value: string;
  readonly dataTitle: string;
  readonly icon?: string;
}

interface TableRow {
  [TableColumn.Actions]: Row[];
  [TableColumn.CreatedAt]: Row;
  [TableColumn.Status]: Row;
  [TableColumn.Id]: Row;
  [TableColumn.Rating]: Row;
  [TableColumn.Customer]: Row;
  [TableColumn.UpdatedAt]: Row;
  [TableColumn.UpdatedByUserId]: Row;
}

const getTableHeaders = (): readonly TableHeader[] => {
  return [
    {
      title: $t('app_created_at'),
      key: TableColumn.CreatedAt,
    },
    {
      title: $t('app_status'),
      key: TableColumn.Status,
    },
    {
      title: $t('app_rating'),
      key: TableColumn.Rating,
    },
    {
      title: $t('app_customer'),
      key: TableColumn.Customer,
    },
    {
      title: $t('app_updated_at'),
      key: TableColumn.UpdatedAt,
    },
    {
      title: $t('app_user'),
      key: TableColumn.UpdatedByUserId,
    },
    {
      title: $t('app_action_add'),
      key: TableColumn.Actions,
    },
  ];
};

enum Action {
  Add = 'add',
  Edit = 'edit',
}

const getTableRows = (feedbacks: readonly Feedback[]): readonly TableRow[] => {
  console.log('feedbacks');
  console.log(feedbacks);
  return feedbacks.map((feedback) => {
    return {
      [TableColumn.Id]: {
        dataTitle: $t('app_id'),
        value: feedback.id,
      },
      [TableColumn.CreatedAt]: {
        dataTitle: $t('app_created_at'),
        value: asDateTime(feedback.createdAt),
      },
      [TableColumn.Status]: {
        dataTitle: $t('app_status'),
        value: feedback.status,
      },
      [TableColumn.Rating]: {
        dataTitle: $t('app_rating'),
        value: String(feedback.rating),
      },
      [TableColumn.Customer]: {
        dataTitle: $t('app_customer'),
        value: feedback.customer,
      },
      [TableColumn.UpdatedAt]: {
        dataTitle: $t('app_updated_at'),
        value: asDateTime(feedback.updatedAt),
      },
      [TableColumn.UpdatedByUserId]: {
        dataTitle: $t('app_user'),
        value: feedback.updatedByUserId ?? '',
      },
      [TableColumn.Actions]: [
        {
          dataTitle: $t('app_edit'),
          value: Action.Edit,
          icon: 'fa-solid fa-pencil',
        },
      ],
    };
  });
};

export const addTable = async (): Promise<void> => {
  const container = document.querySelector('.admin-feedbacks-page__content');
  if (!container) {
    return;
  }
  const feedbacks = await apiFeedbacks.getFeedbacks();
  const template = document.createElement('template');
  try {
    template.innerHTML = getFeedbacksDataTable({
      tableHeaders: getTableHeaders(),
      tableRows: getTableRows(feedbacks),
    });
  } catch (error) {
    show.error('Помилка при відображенні таблиці відгуків');
    console.error(error);
    return;
  }
  const templateContent = template.content;
  container.appendChild(templateContent);
};

const onTableClick = (event: Event): void => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute('data-action') ?? target.parentElement?.getAttribute('data-action');
  const feedbackId = target.getAttribute('data-feedback-id') ?? target.parentElement?.getAttribute('data-feedback-id');
  if (action === Action.Add) {
    onActionAdd().then((result) => {
      if (!result) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      saveFeedback(result).then(() => {
        toast.success('Відгук додано');
      }).catch(() => {
        show.error('Помилка при оновлені відгуку');
      });
    }).catch(() => {
      show.error('Помилка при відкритті попапу');
    });
  }
  if (action === Action.Edit && feedbackId) {
    console.log('edit');
    onActionEdit(feedbackId).then((result) => {
      if (!result) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      saveFeedback(result).then(() => {
        toast.success('Відгук додано');
      }).catch(() => {
        show.error('Помилка при оновлені відгуку');
      });
    }).catch(() => {
      show.error('Помилка при відкритті попапу');
    });
  }
};

export const addTableActionsHandlers = (): void => {
  const table = document.getElementById('feedbacks-table');
  if (!table) {
    show.error('Таблицю відгуків не знайдено');
    return;
  }
  table.addEventListener('click', onTableClick);
};

// eslint-disable-next-line func-style
async function saveFeedback(feedback: Feedback|null): Promise<void> {
  if (!feedback) {
    return;
  }
  const feedbackSaved = await apiFeedbacks.saveFeedback(feedback).catch(() => {
    show.error('Помилка при оновлені відгуку');
    return null;
  });
  if (!feedbackSaved) {
    show.error('Помилка при оновлені відгуку');
    return;
  }
  const table = document.getElementById('feedbacks-table');
  if (!table) {
    show.error('Контейнер для таблиці відгуків не знайдено');
    return;
  }
  table.remove();
  await addTable().catch(() => {
    show.error($t('app_application_error'));
  });
  addTableActionsHandlers();
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.AdminFeedbacks] });
  await translateManager.init();
  translateManager.translatePage();
}
