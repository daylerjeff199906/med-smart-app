-- =====================================================
-- MÓDULO PASTILLERO & BOTIQUÍN - BEQUI App
-- Script de creación de tablas y políticas RLS
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE medication_form AS ENUM (
    'tablet',
    'capsule',
    'liquid',
    'injection',
    'inhaler',
    'cream',
    'drops',
    'patch',
    'suppository',
    'other'
);

CREATE TYPE dose_unit AS ENUM (
    'mg',
    'ml',
    'mcg',
    'g',
    'tablet(s)',
    'capsule(s)',
    'drop(s)',
    'puff(s)',
    'unit(s)'
);

CREATE TYPE medication_frequency AS ENUM (
    'once_daily',
    'twice_daily',
    'three_times_daily',
    'four_times_daily',
    'every_x_hours',
    'as_needed',
    'weekly',
    'specific_days'
);

CREATE TYPE medication_status AS ENUM (
    'taken',
    'pending',
    'skipped',
    'missed',
    'postponed'
);

CREATE TYPE medication_time_of_day AS ENUM (
    'morning',
    'afternoon',
    'evening',
    'night',
    'with_meals',
    'fasting',
    'specific_time'
);

-- =====================================================
-- TABLA: medication_plans (El Botiquín y Configuración)
-- =====================================================

CREATE TABLE public.medication_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prescription_id UUID,
    name VARCHAR(255) NOT NULL,
    form medication_form NOT NULL,
    dose_amount NUMERIC(10, 2) NOT NULL,
    dose_unit dose_unit NOT NULL,
    frequency medication_frequency NOT NULL,
    frequency_interval INTEGER,
    frequency_days INTEGER[],
    times_of_day medication_time_of_day[],
    specific_times TEXT[],
    instructions TEXT,
    current_stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    expiration_date TIMESTAMPTZ,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    notify_via_email BOOLEAN DEFAULT false,
    sync_to_calendar BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: medication_logs (El Historial Diario)
-- =====================================================

CREATE TABLE public.medication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES medication_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    actual_taken_time TIMESTAMPTZ,
    status medication_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    dose_taken NUMERIC(10, 2),
    dose_taken_unit dose_unit,
    missed_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_medication_plans_user_id ON public.medication_plans(user_id);
CREATE INDEX idx_medication_plans_is_active ON public.medication_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_medication_logs_plan_id ON public.medication_logs(plan_id);
CREATE INDEX idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX idx_medication_logs_scheduled_date ON public.medication_logs(scheduled_date);
CREATE INDEX idx_medication_logs_status ON public.medication_logs(status);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.medication_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver sus propios planes de medicación
CREATE POLICY "Users can view own medication plans"
ON public.medication_plans FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuarios pueden insertar sus propios planes de medicación
CREATE POLICY "Users can insert own medication plans"
ON public.medication_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar sus propios planes de medicación
CREATE POLICY "Users can update own medication plans"
ON public.medication_plans FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propios planes de medicación
CREATE POLICY "Users can delete own medication plans"
ON public.medication_plans FOR DELETE
USING (auth.uid() = user_id);

-- Política: Usuarios pueden ver sus propios logs de medicación
CREATE POLICY "Users can view own medication logs"
ON public.medication_logs FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuarios pueden insertar sus propios logs de medicación
CREATE POLICY "Users can insert own medication logs"
ON public.medication_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar sus propios logs de medicación
CREATE POLICY "Users can update own medication logs"
ON public.medication_logs FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propios logs de medicación
CREATE POLICY "Users can delete own medication logs"
ON public.medication_logs FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en medication_plans
CREATE TRIGGER update_medication_plans_updated_at
    BEFORE UPDATE ON public.medication_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener medicamentos del día
CREATE OR REPLACE FUNCTION get_today_medications(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    form medication_form,
    dose_amount NUMERIC,
    dose_unit dose_unit,
    scheduled_time TIME,
    status medication_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id,
        mp.name,
        mp.form,
        mp.dose_amount,
        mp.dose_unit,
        (mp.specific_times)[1] as scheduled_time,
        COALESCE(ml.status, 'pending'::medication_status) as status
    FROM public.medication_plans mp
    LEFT JOIN public.medication_logs ml 
        ON mp.id = ml.plan_id 
        AND ml.scheduled_date = CURRENT_DATE
    WHERE mp.user_id = user_uuid 
        AND mp.is_active = true
    ORDER BY mp.specific_times ASC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.medication_plans IS 'Planes de medicación - define qué medicamentos toma el usuario, cómo y cuándo';
COMMENT ON TABLE public.medication_logs IS 'Registro diario de medicación - historial de tomas reales del usuario';
COMMENT ON COLUMN public.medication_plans.notify_via_email IS 'Flag para activar notificaciones por email via Resend';
COMMENT ON COLUMN public.medication_plans.sync_to_calendar IS 'Flag para sincronizar con Google Calendar';
