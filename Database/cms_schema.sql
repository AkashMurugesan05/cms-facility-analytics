--
-- PostgreSQL database dump
--

\restrict L2EI5mfAzIqqUWtnJmaqRGF3iWTqzMBeCudLFYhRBfCPcflgqk4Z7pSJBlUzJty

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-14 04:11:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 16478)
-- Name: cleaned_fy_2026_snf_vbp_aggregate_performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_fy_2026_snf_vbp_aggregate_performance (
    report_month date,
    base_fy22_nat_avg_risk_std_readmission_rate text,
    perf_fy24_nat_avg_risk_std_readmission_rate text,
    snfrm_achievement_threshold text,
    snfrm_benchmark text,
    base_fy22_nat_avg_risk_std_hai_rate text,
    perf_fy24_nat_avg_risk_std_hai_rate text,
    snf_hai_achievement_threshold text,
    snf_hai_benchmark text,
    base_fy22_nat_avg_total_nursing_staff_turnover_rate text,
    perf_fy24_nat_avg_total_nursing_staff_turnover_rate text,
    total_nursing_staff_turnover_achievement_threshold text,
    total_nursing_staff_turnover_benchmark text,
    base_fy22_nat_avg_adj_total_nurse_staff_hrs_res_day text,
    perf_fy24_nat_avg_adj_total_nurse_staff_hrs_res_day text,
    total_nurse_staffing_achievement_threshold text,
    total_nurse_staffing_benchmark text,
    range_of_performance_scores text,
    total_snfs_receiving_value_based_incentive_payments text,
    range_of_incentive_payment_multipliers text,
    range_of_value_based_incentive_payments_dollars text,
    total_amount_of_value_based_incentive_payments_dollars text
);


ALTER TABLE public.cleaned_fy_2026_snf_vbp_aggregate_performance OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16473)
-- Name: cleaned_fy_2026_snf_vbp_facility_performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_fy_2026_snf_vbp_facility_performance (
    report_month date,
    snf_vbp_program_ranking text,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    base_fy22_risk_standardized_readmission_rate text,
    fn_base_fy22_risk_standardized_readmission_rate text,
    perf_fy24_risk_standardized_readmission_rate text,
    fn_perf_fy24_risk_standardized_readmission_rate text,
    snfrm_achievement_score text,
    fn_snfrm_achievement_score text,
    snfrm_improvement_score text,
    fn_snfrm_improvement_score text,
    snfrm_measure_score text,
    fn_snfrm_measure_score text,
    base_fy22_risk_standardized_hai_rate text,
    fn_base_fy22_risk_standardized_hai_rate text,
    perf_fy24_risk_standardized_hai_rate text,
    fn_perf_fy24_risk_standardized_hai_rate text,
    snf_hai_achievement_score text,
    fn_snf_hai_achievement_score text,
    snf_hai_improvement_score text,
    fn_snf_hai_improvement_score text,
    snf_hai_measure_score text,
    fn_snf_hai_measure_score text,
    base_fy22_total_nursing_staff_turnover_rate text,
    fn_base_fy22_total_nursing_staff_turnover_rate text,
    perf_fy24_total_nursing_staff_turnover_rate text,
    fn_perf_fy24_total_nursing_staff_turnover_rate text,
    total_nursing_staff_turnover_achievement_score text,
    fn_total_nursing_staff_turnover_achievement_score text,
    total_nursing_staff_turnover_improvement_score text,
    fn_total_nursing_staff_turnover_improvement_score text,
    total_nursing_staff_turnover_measure_score text,
    fn_total_nursing_staff_turnover_measure_score text,
    base_fy22_adj_total_nurse_staff_hrs_per_res_day text,
    fn_base_fy22_adj_total_nurse_staff_hrs_per_res_day text,
    perf_fy24_adj_total_nurse_staff_hrs_per_res_day text,
    fn_perf_fy24_adj_total_nurse_staff_hrs_per_res_day text,
    total_nurse_staffing_achievement_score text,
    fn_total_nurse_staffing_achievement_score text,
    total_nurse_staffing_improvement_score text,
    fn_total_nurse_staffing_improvement_score text,
    total_nurse_staffing_measure_score text,
    fn_total_nurse_staffing_measure_score text,
    performance_score text,
    incentive_payment_multiplier text
);


ALTER TABLE public.cleaned_fy_2026_snf_vbp_facility_performance OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16423)
-- Name: cleaned_nh_citationdescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_citationdescriptions (
    report_month date,
    deficiency_prefix text,
    deficiency_tag_number text,
    deficiency_prefix_and_number text,
    deficiency_description text,
    deficiency_category text
);


ALTER TABLE public.cleaned_nh_citationdescriptions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: cleaned_nh_datacollectionintervals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_datacollectionintervals (
    report_month date,
    measure_code text,
    measure_description text,
    data_collection_period_from_date text,
    data_collection_period_through_date text,
    measure_date_range text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_datacollectionintervals OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16413)
-- Name: cleaned_nh_firesafetycitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_firesafetycitations (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    survey_date text,
    survey_type text,
    deficiency_prefix text,
    deficiency_category text,
    deficiency_tag_number text,
    tag_version text,
    deficiency_description text,
    scope_severity_code text,
    deficiency_corrected text,
    correction_date text,
    inspection_cycle text,
    standard_deficiency text,
    complaint_deficiency text,
    infection_control_inspection_deficiency text,
    citation_under_idr text,
    citation_under_iidr text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_firesafetycitations OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16418)
-- Name: cleaned_nh_healthcitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_healthcitations (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    survey_date text,
    survey_type text,
    deficiency_prefix text,
    deficiency_category text,
    deficiency_tag_number text,
    deficiency_description text,
    scope_severity_code text,
    deficiency_corrected text,
    correction_date text,
    inspection_cycle text,
    standard_deficiency text,
    complaint_deficiency text,
    infection_control_inspection_deficiency text,
    citation_under_idr text,
    citation_under_iidr text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_healthcitations OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16428)
-- Name: cleaned_nh_hlthinspeccutpointsstate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_hlthinspeccutpointsstate (
    report_month date,
    state text,
    "5_stars" text,
    "4_stars" text,
    "3_stars" text,
    "2_stars" text,
    "1_star" text
);


ALTER TABLE public.cleaned_nh_hlthinspeccutpointsstate OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16448)
-- Name: cleaned_nh_ownership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_ownership (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    role_played_by_owner_or_manager_in_facility text,
    owner_type text,
    owner_name text,
    ownership_percentage text,
    association_date text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_ownership OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16453)
-- Name: cleaned_nh_penalties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_penalties (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    penalty_date text,
    penalty_type text,
    fine_amount text,
    payment_denial_start_date text,
    payment_denial_length_in_days text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_penalties OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16393)
-- Name: cleaned_nh_providerinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_providerinfo (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    telephone_number text,
    provider_ssa_county_code text,
    county_parish text,
    urban text,
    ownership_type text,
    number_of_certified_beds text,
    average_number_of_residents_per_day text,
    avg_residents_per_day_footnote text,
    provider_type text,
    provider_resides_in_hospital text,
    legal_business_name text,
    date_first_approved_medicare_medicaid text,
    chain_name text,
    chain_id text,
    number_of_facilities_in_chain text,
    chain_avg_overall_5_star_rating text,
    chain_avg_health_inspection_rating text,
    chain_avg_staffing_rating text,
    chain_avg_qm_rating text,
    continuing_care_retirement_community text,
    special_focus_status text,
    abuse_icon text,
    recent_health_inspection_over_2_years_ago text,
    provider_changed_ownership_in_last_12_months text,
    with_a_resident_and_family_council text,
    automatic_sprinkler_systems_in_all_required_areas text,
    overall_rating text,
    overall_rating_footnote text,
    health_inspection_rating text,
    health_inspection_rating_footnote text,
    qm_rating text,
    qm_rating_footnote text,
    long_stay_qm_rating text,
    long_stay_qm_rating_footnote text,
    short_stay_qm_rating text,
    short_stay_qm_rating_footnote text,
    staffing_rating text,
    staffing_rating_footnote text,
    reported_staffing_footnote text,
    physical_therapist_staffing_footnote text,
    reported_nurse_aide_staffing_hours_per_res_day text,
    reported_lpn_staffing_hours_per_res_day text,
    reported_rn_staffing_hours_per_res_day text,
    reported_licensed_staffing_hours_per_res_day text,
    reported_total_nurse_staffing_hours_per_res_day text,
    total_nurse_staff_hrs_res_day_on_weekend text,
    rn_hours_per_resident_per_day_on_weekend text,
    reported_pt_staffing_hours_per_res_day text,
    total_nursing_staff_turnover text,
    total_nursing_staff_turnover_footnote text,
    registered_nurse_turnover text,
    registered_nurse_turnover_footnote text,
    num_administrators_left_nursing_home text,
    administrator_turnover_footnote text,
    nursing_case_mix_index text,
    nursing_case_mix_index_ratio text,
    case_mix_nurse_aide_staffing_hrs_per_res_day text,
    case_mix_lpn_staffing_hrs_per_res_day text,
    case_mix_rn_staffing_hrs_per_res_day text,
    case_mix_total_nurse_staffing_hrs_per_res_day text,
    case_mix_weekend_total_nurse_staffing_hrs_per_res_day text,
    adjusted_nurse_aide_staffing_hrs_per_res_day text,
    adjusted_lpn_staffing_hrs_per_res_day text,
    adjusted_rn_staffing_hrs_per_res_day text,
    adjusted_total_nurse_staffing_hrs_per_res_day text,
    adjusted_weekend_total_nurse_staffing_hrs_per_res_day text,
    rating_cycle_1_standard_survey_health_date text,
    rating_cycle_1_total_health_deficiencies text,
    rating_cycle_1_standard_health_deficiencies text,
    rating_cycle_1_complaint_health_deficiencies text,
    rating_cycle_1_health_deficiency_score text,
    rating_cycle_1_health_revisits text,
    rating_cycle_1_health_revisit_score text,
    rating_cycle_1_total_health_score text,
    rating_cycle_2_standard_health_survey_date text,
    rating_cycle_2_3_total_health_deficiencies text,
    rating_cycle_2_standard_health_deficiencies text,
    rating_cycle_2_3_complaint_health_deficiencies text,
    rating_cycle_2_3_health_deficiency_score text,
    rating_cycle_2_3_health_revisits text,
    rating_cycle_2_3_health_revisit_score text,
    rating_cycle_2_3_total_health_score text,
    total_weighted_health_survey_score text,
    num_citations_from_infection_control_inspections text,
    number_of_fines text,
    total_amount_of_fines_in_dollars text,
    number_of_payment_denials text,
    total_number_of_penalties text,
    location text,
    latitude text,
    longitude text,
    geocoding_footnote text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_providerinfo OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16443)
-- Name: cleaned_nh_qualitymsr_claims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_qualitymsr_claims (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    measure_code text,
    measure_description text,
    resident_type text,
    adjusted_score text,
    observed_score text,
    expected_score text,
    footnote_for_score text,
    used_in_quality_measure_five_star_rating text,
    measure_period text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_qualitymsr_claims OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16438)
-- Name: cleaned_nh_qualitymsr_mds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_qualitymsr_mds (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    measure_code text,
    measure_description text,
    resident_type text,
    q1_measure_score text,
    footnote_for_q1_measure_score text,
    q2_measure_score text,
    footnote_for_q2_measure_score text,
    q3_measure_score text,
    footnote_for_q3_measure_score text,
    q4_measure_score text,
    footnote_for_q4_measure_score text,
    four_quarter_average_score text,
    footnote_for_four_quarter_avg_score text,
    used_in_quality_measure_five_star_rating text,
    measure_period text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_qualitymsr_mds OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: cleaned_nh_stateusaverages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_stateusaverages (
    report_month date,
    state_or_nation text,
    overall_rating text,
    health_inspection_rating text,
    qm_rating text,
    staffing_rating text,
    cycle_1_total_health_deficiencies text,
    cycle_1_total_fire_safety_deficiencies text,
    cycle_2_total_health_deficiencies text,
    cycle_2_total_fire_safety_deficiencies text,
    cycle_3_total_health_deficiencies text,
    cycle_3_total_fire_safety_deficiencies text,
    average_number_of_residents_per_day text,
    reported_nurse_aide_staffing_hrs_per_res_day text,
    reported_lpn_staffing_hrs_per_res_day text,
    reported_rn_staffing_hrs_per_res_day text,
    reported_licensed_staffing_hrs_per_res_day text,
    reported_total_nurse_staffing_hrs_per_res_day text,
    total_nurse_staff_hrs_res_day_on_weekend text,
    rn_hours_per_resident_per_day_on_weekend text,
    reported_pt_staffing_hours_per_res_day text,
    total_nursing_staff_turnover text,
    registered_nurse_turnover text,
    num_administrators_left_nursing_home text,
    nursing_case_mix_index text,
    case_mix_rn_staffing_hrs_per_res_day text,
    case_mix_total_nurse_staffing_hrs_per_res_day text,
    case_mix_weekend_total_nurse_staffing_hrs_per_res_day text,
    number_of_fines text,
    fine_amount_in_dollars text,
    pct_ls_res_help_daily_activities_increased text,
    pct_ls_res_lose_too_much_weight text,
    pct_ls_res_catheter_inserted_left_in_bladder text,
    pct_ls_res_with_uti text,
    pct_ls_res_with_depressive_symptoms text,
    pct_ls_res_physically_restrained text,
    pct_ls_res_falls_major_injury text,
    pct_ls_res_given_pneumococcal_vaccine text,
    pct_ls_res_received_antipsychotic_med text,
    pct_ss_res_given_pneumococcal_vaccine text,
    pct_ss_res_newly_received_antipsychotic_med text,
    pct_ls_res_walk_independently_worsened text,
    pct_ls_res_received_antianxiety_hypnotic_med text,
    pct_ls_res_given_seasonal_influenza_vaccine text,
    pct_ss_res_given_seasonal_influenza_vaccine text,
    pct_ls_res_with_pressure_ulcers text,
    pct_ls_res_worsened_bowel_bladder_incontinence text,
    pct_ss_res_rehospitalized_after_admission text,
    pct_ss_res_outpatient_ed_visit text,
    num_hospitalizations_per_1000_ls_res_days text,
    num_outpatient_ed_visits_per_1000_ls_res_days text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_stateusaverages OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: cleaned_nh_surveydates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_surveydates (
    report_month date,
    cms_certification_number_ccn text,
    survey_date text,
    type_of_survey text,
    survey_cycle text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_surveydates OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16433)
-- Name: cleaned_nh_surveysummary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_nh_surveysummary (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    provider_address text,
    city_town text,
    state text,
    zip_code text,
    inspection_cycle text,
    health_survey_date text,
    fire_safety_survey_date text,
    total_health_deficiencies text,
    total_fire_safety_deficiencies text,
    count_freedom_from_abuse_neglect_exploitation_deficiencies text,
    count_quality_of_life_and_care_deficiencies text,
    count_resident_assessment_and_care_planning_defic text,
    count_nursing_and_physician_services_deficiencies text,
    count_resident_rights_deficiencies text,
    count_nutrition_and_dietary_deficiencies text,
    count_pharmacy_service_deficiencies text,
    count_environmental_deficiencies text,
    count_administration_deficiencies text,
    count_infection_control_deficiencies text,
    count_emergency_preparedness_deficiencies text,
    count_automatic_sprinkler_systems_deficiencies text,
    count_construction_deficiencies text,
    count_services_deficiencies text,
    count_corridor_walls_and_doors_deficiencies text,
    count_egress_deficiencies text,
    count_electrical_deficiencies text,
    count_emergency_plans_and_fire_drills_deficiencies text,
    count_fire_alarm_systems_deficiencies text,
    count_smoke_deficiencies text,
    count_interior_deficiencies text,
    count_gas_and_vacuum_and_electrical_systems_defic text,
    count_hazardous_area_deficiencies text,
    count_illumination_and_emergency_power_defic text,
    count_laboratories_deficiencies text,
    count_medical_gases_and_anaesthetizing_areas_defic text,
    count_smoking_regulations_deficiencies text,
    count_miscellaneous_deficiencies text,
    location text,
    processing_date text
);


ALTER TABLE public.cleaned_nh_surveysummary OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16458)
-- Name: cleaned_snf_qrp_national_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_snf_qrp_national_data (
    report_month date,
    cms_certification_number_ccn text,
    measure_code text,
    score text,
    footnote text,
    start_date text,
    end_date text,
    measure_date_range text
);


ALTER TABLE public.cleaned_snf_qrp_national_data OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16463)
-- Name: cleaned_snf_qrp_provider_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_snf_qrp_provider_data (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    address_line_1 text,
    city_town text,
    state text,
    zip_code text,
    county_parish text,
    telephone_number text,
    cms_region text,
    measure_code text,
    score text,
    footnote text,
    start_date text,
    end_date text,
    measure_date_range text,
    location1 text
);


ALTER TABLE public.cleaned_snf_qrp_provider_data OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16468)
-- Name: cleaned_swing_bed_snf_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cleaned_swing_bed_snf_data (
    report_month date,
    cms_certification_number_ccn text,
    provider_name text,
    address_line_1 text,
    address_line_2 text,
    city_town text,
    state text,
    zip_code text,
    county_parish text,
    telephone_number text,
    cms_region text,
    measure_code text,
    score text,
    footnote text,
    start_date text,
    end_date text,
    measuredaterange text
);


ALTER TABLE public.cleaned_swing_bed_snf_data OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16551)
-- Name: view_facility_performance; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_facility_performance AS
 SELECT report_month,
    cms_certification_number_ccn AS ccn,
    provider_name,
    city_town AS city,
    state,
    zip_code,
    (NULLIF(NULLIF(number_of_certified_beds, 'Not Available'::text), ''::text))::integer AS certified_beds,
    (NULLIF(NULLIF(average_number_of_residents_per_day, 'Not Available'::text), ''::text))::numeric(8,2) AS avg_residents_per_day,
    (NULLIF(NULLIF(overall_rating, 'Not Available'::text), ''::text))::integer AS overall_rating,
    (NULLIF(NULLIF(health_inspection_rating, 'Not Available'::text), ''::text))::integer AS health_inspection_rating,
    (NULLIF(NULLIF(qm_rating, 'Not Available'::text), ''::text))::integer AS qm_rating,
    (NULLIF(NULLIF(staffing_rating, 'Not Available'::text), ''::text))::integer AS staffing_rating,
    (NULLIF(NULLIF(chain_avg_overall_5_star_rating, 'Not Available'::text), ''::text))::numeric(5,2) AS chain_avg_overall_rating,
    (NULLIF(NULLIF(reported_total_nurse_staffing_hours_per_res_day, 'Not Available'::text), ''::text))::numeric(8,4) AS reported_total_nurse_hrs,
    (NULLIF(NULLIF(reported_rn_staffing_hours_per_res_day, 'Not Available'::text), ''::text))::numeric(8,4) AS reported_rn_hrs,
    (NULLIF(NULLIF(total_weighted_health_survey_score, 'Not Available'::text), ''::text))::numeric(8,2) AS total_weighted_health_score,
    (NULLIF(NULLIF(number_of_fines, 'Not Available'::text), ''::text))::integer AS number_of_fines,
    (NULLIF(NULLIF(total_amount_of_fines_in_dollars, 'Not Available'::text), ''::text))::numeric(12,2) AS total_fine_amount
   FROM public.cleaned_nh_providerinfo;


ALTER VIEW public.view_facility_performance OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16565)
-- Name: view_penalties; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_penalties AS
 SELECT report_month,
    cms_certification_number_ccn AS ccn,
    penalty_type,
    (NULLIF(NULLIF(penalty_date, 'Not Available'::text), ''::text))::date AS penalty_date,
    (NULLIF(NULLIF(fine_amount, 'Not Available'::text), ''::text))::numeric(12,2) AS fine_amount,
    (NULLIF(NULLIF(payment_denial_length_in_days, 'Not Available'::text), ''::text))::integer AS denial_length_days
   FROM public.cleaned_nh_penalties;


ALTER VIEW public.view_penalties OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16561)
-- Name: view_quality_measures; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_quality_measures AS
 SELECT report_month,
    cms_certification_number_ccn AS ccn,
    measure_code,
    measure_description,
    resident_type,
    (NULLIF(NULLIF(q1_measure_score, 'Not Available'::text), ''::text))::numeric(8,2) AS q1_score,
    (NULLIF(NULLIF(q2_measure_score, 'Not Available'::text), ''::text))::numeric(8,2) AS q2_score,
    (NULLIF(NULLIF(q3_measure_score, 'Not Available'::text), ''::text))::numeric(8,2) AS q3_score,
    (NULLIF(NULLIF(q4_measure_score, 'Not Available'::text), ''::text))::numeric(8,2) AS q4_score,
    (NULLIF(NULLIF(four_quarter_average_score, 'Not Available'::text), ''::text))::numeric(8,2) AS four_quarter_avg_score
   FROM public.cleaned_nh_qualitymsr_mds;


ALTER VIEW public.view_quality_measures OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16556)
-- Name: view_state_national_averages; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_state_national_averages AS
 SELECT report_month,
    state_or_nation,
    (NULLIF(NULLIF(overall_rating, 'Not Available'::text), ''::text))::numeric(5,2) AS overall_rating,
    (NULLIF(NULLIF(health_inspection_rating, 'Not Available'::text), ''::text))::numeric(5,2) AS health_inspection_rating,
    (NULLIF(NULLIF(qm_rating, 'Not Available'::text), ''::text))::numeric(5,2) AS qm_rating,
    (NULLIF(NULLIF(staffing_rating, 'Not Available'::text), ''::text))::numeric(5,2) AS staffing_rating,
    (NULLIF(NULLIF(reported_total_nurse_staffing_hrs_per_res_day, 'Not Available'::text), ''::text))::numeric(8,4) AS reported_total_nurse_hrs,
    (NULLIF(NULLIF(reported_rn_staffing_hrs_per_res_day, 'Not Available'::text), ''::text))::numeric(8,4) AS reported_rn_hrs,
    (NULLIF(NULLIF(pct_ls_res_falls_major_injury, 'Not Available'::text), ''::text))::numeric(8,2) AS pct_ls_falls_major_injury,
    (NULLIF(NULLIF(pct_ls_res_with_pressure_ulcers, 'Not Available'::text), ''::text))::numeric(8,2) AS pct_ls_pressure_ulcers,
    (NULLIF(NULLIF(pct_ss_res_outpatient_ed_visit, 'Not Available'::text), ''::text))::numeric(8,2) AS pct_ss_ed_visit
   FROM public.cleaned_nh_stateusaverages;


ALTER VIEW public.view_state_national_averages OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16569)
-- Name: view_survey_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_survey_summary AS
 SELECT report_month,
    cms_certification_number_ccn AS ccn,
    inspection_cycle,
    (NULLIF(NULLIF(health_survey_date, 'Not Available'::text), ''::text))::date AS health_survey_date,
    (NULLIF(NULLIF(total_health_deficiencies, 'Not Available'::text), ''::text))::integer AS total_health_deficiencies,
    (NULLIF(NULLIF(count_infection_control_deficiencies, 'Not Available'::text), ''::text))::integer AS count_infection_control_defic,
    (NULLIF(NULLIF(count_resident_rights_deficiencies, 'Not Available'::text), ''::text))::integer AS count_resident_rights_defic
   FROM public.cleaned_nh_surveysummary;


ALTER VIEW public.view_survey_summary OWNER TO postgres;

-- Completed on 2026-07-14 04:11:27

--
-- PostgreSQL database dump complete
--

\unrestrict L2EI5mfAzIqqUWtnJmaqRGF3iWTqzMBeCudLFYhRBfCPcflgqk4Z7pSJBlUzJty

