// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { BookingDetail } from '@/features/booking/ui/booking-detail';
import { BookingFooter } from '@/features/booking/ui/booking-footer';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Container } from '@/shared/ui';
import { Stepper } from '@/shared/ui/stepper/stepper';
import type { StepItem } from '@/shared/ui/stepper/stepper.types';
import { Header } from '@/widgets/header';

const Booking = async () => {
  const { t } = await getTranslation('booking');

  const steps: StepItem[] = [
    {
      id: 'selection',
      label: t('steps.selection'),
    },
    {
      id: 'details',
      label: t('steps.details'),
    },
    {
      id: 'finish',
      label: t('steps.finish'),
    },
  ];

  return (
    <>
      <Header />
      <main>
        <Container>
          <div style={{ margin: '20px 0' }}>
            <Stepper activeStep={1} steps={steps} />
          </div>
        </Container>
        <Container $fluidMobile>
          <BookingDetail />
        </Container>
      </main>
      <BookingFooter />
    </>
  );
};

export default Booking;
