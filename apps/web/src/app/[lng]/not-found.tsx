// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Container, Heading } from '@/shared/ui';

const NotFound = async () => {
  const { t } = await getTranslation('common');

  return (
    <Container>
      <Heading $size="2xl" as="h2">
        {t('status.notFound')}
      </Heading>
    </Container>
  );
};

export default NotFound;
