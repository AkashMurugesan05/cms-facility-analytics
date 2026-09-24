import os
import json 
from sqlalchemy import create_engine, text
from playwright.sync_api import sync_playwright

DB_URL = "postgresql://postgres:Aryan$0599@localhost:5432/cms_analytics"
engine = create_engine(DB_URL)

def get_report_dates(engine):
    query = text("""
        SELECT DISTINCT report_month 
        FROM view_facility_performance 
        ORDER BY report_month DESC 
        LIMIT 2;
    """)
    with engine.connect() as conn:
        result = conn.execute(query).fetchall()
    if len(result) < 2:
        raise ValueError("Need at least two months of data to calculate trends.")
    return result[0][0], result[1][0]

def get_facility_metrics(engine, ccn, report_month):
    query = text("""
        SELECT 
            v.provider_name, 
            v.state, 
            v.overall_rating,
            v.health_inspection_rating AS health_rating,
            p.staffing_rating,
            p.qm_rating,
            v.certified_beds,
            v.avg_residents_per_day,
            p.total_nursing_staff_turnover,
            p.registered_nurse_turnover,
            p.rating_cycle_1_total_health_deficiencies,
            p.total_amount_of_fines_in_dollars,
            p.adjusted_rn_staffing_hrs_per_res_day,
            p.adjusted_nurse_aide_staffing_hrs_per_res_day,
            p.adjusted_total_nurse_staffing_hrs_per_res_day,
            p.rating_cycle_1_standard_health_deficiencies,
            p.rating_cycle_1_complaint_health_deficiencies,
            p.num_citations_from_infection_control_inspections,
            p.adjusted_lpn_staffing_hrs_per_res_day,
            p.rating_cycle_2_3_total_health_deficiencies,
            p.long_stay_qm_rating,
            p.short_stay_qm_rating,
            p.total_number_of_penalties,
            p.number_of_fines,
            p.nursing_case_mix_index,
            p.adjusted_weekend_total_nurse_staffing_hrs_per_res_day,
            p.rating_cycle_1_standard_survey_health_date,
            p.rating_cycle_1_health_revisits,
            p.abuse_icon,                                    
            p.special_focus_status,                          
            p.num_administrators_left_nursing_home,
            p.num_administrators_left_nursing_home,
            p.chain_name,
            p.chain_avg_overall_5_star_rating,
            p.chain_avg_health_inspection_rating,
            p.chain_avg_qm_rating,
            p.chain_avg_staffing_rating            
        FROM view_facility_performance v
        LEFT JOIN cleaned_nh_providerinfo p 
            ON v.ccn = p.cms_certification_number_ccn 
            AND v.report_month = p.report_month
        WHERE v.ccn = :ccn AND v.report_month = :report_month
        LIMIT 1
    """)
    with engine.connect() as conn:
        return conn.execute(query, {"ccn": ccn, "report_month": report_month}).mappings().fetchone()

def get_historical_trends(engine, ccn):
    query = text("""
        SELECT * FROM (
            SELECT 
                v.report_month,
                v.overall_rating,
                v.health_inspection_rating,
                p.staffing_rating,
                p.qm_rating,
                p.long_stay_qm_rating,
                p.short_stay_qm_rating,
                p.adjusted_total_nurse_staffing_hrs_per_res_day AS total_hrs,
                p.adjusted_rn_staffing_hrs_per_res_day AS rn_hrs,
                p.total_nursing_staff_turnover,
                p.registered_nurse_turnover
            FROM view_facility_performance v
            LEFT JOIN cleaned_nh_providerinfo p 
                ON v.ccn = p.cms_certification_number_ccn 
                AND v.report_month = p.report_month
            WHERE v.ccn = :ccn
            ORDER BY v.report_month DESC
            LIMIT 6
        ) sub
        ORDER BY report_month ASC;
    """)
    
    with engine.connect() as conn:
        results = conn.execute(query, {"ccn": ccn}).mappings().fetchall()

    months = []
    overall, health, staffing, qm = [], [], [], []
    total_hrs, rn_hrs = [], []
    ls_qm, ss_qm = [], []
    total_to, rn_to = [], []

    for row in results:
        months.append(row["report_month"].strftime("%b %Y") if row["report_month"] else "Unknown")
        
        overall.append(float(row["overall_rating"] or 0))
        health.append(float(row["health_inspection_rating"] or 0))
        staffing.append(float(row["staffing_rating"] or 0))
        qm.append(float(row["qm_rating"] or 0))
        
        total_hrs.append(float(row["total_hrs"] or 0))
        rn_hrs.append(float(row["rn_hrs"] or 0))
        
        ls_qm.append(float(row["long_stay_qm_rating"] or 0))
        ss_qm.append(float(row["short_stay_qm_rating"] or 0))
        
        total_to.append(float(row["total_nursing_staff_turnover"] or 0))
        rn_to.append(float(row["registered_nurse_turnover"] or 0))

    return {
        "{{TREND_MONTHS}}": json.dumps(months),
        "{{TREND_OVERALL}}": json.dumps(overall),
        "{{TREND_HEALTH}}": json.dumps(health),
        "{{TREND_STAFFING}}": json.dumps(staffing),
        "{{TREND_QM}}": json.dumps(qm),
        "{{TREND_TOTAL_HRS}}": json.dumps(total_hrs),
        "{{TREND_RN_HRS}}": json.dumps(rn_hrs),
        "{{TREND_LS_QM}}": json.dumps(ls_qm),
        "{{TREND_SS_QM}}": json.dumps(ss_qm),
        "{{TREND_TOTAL_TO}}": json.dumps(total_to),
        "{{TREND_RN_TO}}": json.dumps(rn_to)
    }

def calculate_trend(latest_val, prev_val):
    if latest_val is None or prev_val is None:
        return "N/A", "neutral"
        
    latest = float(latest_val)
    prev = float(prev_val)
    diff = latest - prev
    
    if diff > 0:
        return f"+{int(diff)} Star{'s' if diff > 1 else ''}", "positive"
    elif diff < 0:
        return f"{int(diff)} Star{'s' if diff < -1 else ''}", "negative"
    else:
        return "No Change", "neutral"

def generate_pdf(ccn):
    latest_date, previous_date = get_report_dates(engine)
    latest_data = get_facility_metrics(engine, ccn, latest_date)
    previous_data = get_facility_metrics(engine, ccn, previous_date)

    trend_replacements = get_historical_trends(engine, ccn)

    if not latest_data:
        print(f"Could not find data for CCN {ccn}")
        return

    provider = latest_data["provider_name"] or "Unknown Facility"
    overall_rating = str(float(latest_data["overall_rating"] or 0))
    rating_int = int(float(latest_data["overall_rating"] or 0))
    star_symbols = ("★" * rating_int) + ("☆" * (5 - rating_int))

    state_abbr = latest_data["state"] or "Unknown"
    state_avg = "N/A"
    nat_avg = "N/A"
    
    state_staffing = "N/A"
    nat_staffing = "N/A"
    state_total_hrs = "N/A"
    nat_total_hrs = "N/A"
    state_rn_hrs = "N/A"
    nat_rn_hrs = "N/A"

    if state_abbr != "Unknown":
        avg_query = text("""
            SELECT state_or_nation, overall_rating, staffing_rating, health_inspection_rating, qm_rating
            FROM view_state_national_averages 
            WHERE report_month = :report_month 
            AND (state_or_nation = :state OR state_or_nation IN ('National', 'US', 'USA', 'NATION'))
        """)
        with engine.connect() as conn:
            avgs = conn.execute(avg_query, {"report_month": latest_date, "state": state_abbr}).mappings().fetchall()
            
            # Setup defaults for the chart
            state_health, state_qm = "null", "null"
            nat_health, nat_qm = "null", "null"
            
            for row in avgs:
                o_val = row["overall_rating"]
                s_val = row["staffing_rating"]
                h_val = row["health_inspection_rating"]
                q_val = row["qm_rating"]
                
                if row["state_or_nation"] == state_abbr:
                    state_avg = f"{float(o_val):.1f}" if o_val else "N/A"
                    state_staffing = f"{float(s_val):.1f}" if s_val else "N/A"
                    state_health = f"{float(h_val):.1f}" if h_val else "null"
                    state_qm = f"{float(q_val):.1f}" if q_val else "null"
                else:
                    nat_avg = f"{float(o_val):.1f}" if o_val else "N/A"
                    nat_staffing = f"{float(s_val):.1f}" if s_val else "N/A"
                    nat_health = f"{float(h_val):.1f}" if h_val else "null"
                    nat_qm = f"{float(q_val):.1f}" if q_val else "null"

    # --- ACUITY & STAFFING INTENSITY CALCULATIONS ---
    prev_cmi = float(previous_data['nursing_case_mix_index'] or 0) if previous_data else 0.0
    prev_weekend = float(previous_data['adjusted_weekend_total_nurse_staffing_hrs_per_res_day'] or 0) if previous_data else 0.0
    prev_total = float(previous_data['adjusted_total_nurse_staffing_hrs_per_res_day'] or 0) if previous_data else 0.0

    cmi_val = float(latest_data['nursing_case_mix_index'] or 0)
    weekend_hrs_val = float(latest_data['adjusted_weekend_total_nurse_staffing_hrs_per_res_day'] or 0)
    total_hrs_val = float(latest_data['adjusted_total_nurse_staffing_hrs_per_res_day'] or 0)

    # State & National Benchmarks
    state_cmi_bm, nat_cmi_bm = 1.40, 1.35
    state_wk_bm, nat_wk_bm = 2.05, 1.95
    state_tot_bm, nat_tot_bm = 3.00, 2.90

    def get_diff_badge(curr, prev):
        diff = curr - prev
        if diff > 0.005:
            return f"▲ +{diff:.2f}", "positive"
        elif diff < -0.005:
            return f"▼ {diff:.2f}", "negative"
        else:
            return "No Change", "neutral"

    cmi_text, cmi_class = get_diff_badge(cmi_val, prev_cmi)
    weekend_text, weekend_class = get_diff_badge(weekend_hrs_val, prev_weekend)
    total_text, total_class = get_diff_badge(total_hrs_val, prev_total)

    # Value color coding (Green if >= State Benchmark, Red if < State Benchmark)
    cmi_color_class = "text-green" if cmi_val >= state_cmi_bm else "text-red"
    weekend_color_class = "text-green" if weekend_hrs_val >= state_wk_bm else "text-red"
    total_color_class = "text-green" if total_hrs_val >= state_tot_bm else "text-red"

    cmi_str = f"{cmi_val:.2f}"
    weekend_str = f"{weekend_hrs_val:.2f} hrs"
    total_str = f"{total_hrs_val:.2f} hrs"

    # Fire Safety query
    fire_def_query = text("""
        SELECT COUNT(*) FROM cleaned_nh_firesafetycitations 
        WHERE cms_certification_number_ccn = :ccn AND report_month = :report_month
    """)
    with engine.connect() as conn:
        fire_res = conn.execute(fire_def_query, {"ccn": ccn, "report_month": latest_date}).scalar()
        fire_def_count = str(int(fire_res or 0))

    # --- VBP QUERY BLOCK ---
    vbp_score = "N/A"
    vbp_mult = "N/A"
    try:
        # ORDER BY report_month DESC forces the query to pick the latest 2026 data
        vbp_query = text("""
            SELECT * FROM cleaned_fy_2026_snf_vbp_facility_performance 
            WHERE cms_certification_number_ccn = :ccn 
            ORDER BY report_month DESC 
            LIMIT 1
        """)
        with engine.connect() as conn:
            vbp_res = conn.execute(vbp_query, {"ccn": ccn}).mappings().fetchone()
            if vbp_res:
                score = vbp_res.get("performance_score")
                mult = vbp_res.get("incentive_payment_multiplier")
                
                if score and str(score).strip() not in ["", "Not Available", "No Data"]:
                    vbp_score = str(score).strip()
                    
                if mult and str(mult).strip() not in ["", "Not Available", "No Data"]:
                    try:
                        vbp_mult = f"{float(mult):.4f}x"
                    except ValueError:
                        vbp_mult = str(mult).strip()
    except Exception as e:
        print(f"VBP Data Warning: {e}")
    # ------------------------------------

    overall_trend, overall_trend_class = calculate_trend(latest_data["overall_rating"], previous_data["overall_rating"])
    health_trend, health_trend_class = calculate_trend(latest_data["health_rating"], previous_data["health_rating"])
    staffing_trend, staffing_trend_class = calculate_trend(latest_data["staffing_rating"], previous_data["staffing_rating"])
    qm_trend, qm_trend_class = calculate_trend(latest_data["qm_rating"], previous_data["qm_rating"])

    health_score = str(int(float(latest_data["health_rating"] or 0)))
    staffing_score = str(int(float(latest_data["staffing_rating"] or 0)))
    qm_score = str(int(float(latest_data["qm_rating"] or 0)))

    health_offset = str(100 - int((int(health_score) / 5.0) * 100))
    staffing_offset = str(100 - int((int(staffing_score) / 5.0) * 100))
    qm_offset = str(100 - int((int(qm_score) / 5.0) * 100))

    beds = str(int(latest_data["certified_beds"] or 0))
    residents = str(int(latest_data["avg_residents_per_day"] or 0))
    turnover_total = f"{float(latest_data['total_nursing_staff_turnover'] or 0):.1f}%" if latest_data['total_nursing_staff_turnover'] else "N/A"
    turnover_rn = f"{float(latest_data['registered_nurse_turnover'] or 0):.1f}%" if latest_data['registered_nurse_turnover'] else "N/A"
    health_def = str(int(latest_data["rating_cycle_1_total_health_deficiencies"] or 0))
    fines = f"${int(float(latest_data['total_amount_of_fines_in_dollars'] or 0)):,}"

    rn_hrs = f"{float(latest_data['adjusted_rn_staffing_hrs_per_res_day'] or 0):.2f}"
    aide_hrs = f"{float(latest_data['adjusted_nurse_aide_staffing_hrs_per_res_day'] or 0):.2f}"
    lpn_hrs = f"{float(latest_data.get('adjusted_lpn_staffing_hrs_per_res_day') or 0):.2f}"
    cyc2_def = str(int(float(latest_data.get('rating_cycle_2_3_total_health_deficiencies') or 0)))
    total_hrs_p2 = f"{float(latest_data['adjusted_total_nurse_staffing_hrs_per_res_day'] or 0):.2f}"
    std_def = str(int(float(latest_data['rating_cycle_1_standard_health_deficiencies'] or 0)))
    comp_def = str(int(float(latest_data['rating_cycle_1_complaint_health_deficiencies'] or 0)))
    ic_def = str(int(float(latest_data['num_citations_from_infection_control_inspections'] or 0)))
    ls_qm = str(int(float(latest_data['long_stay_qm_rating'] or 0)))
    ss_qm = str(int(float(latest_data['short_stay_qm_rating'] or 0)))

    # New Health Inspection Key Drivers
    last_survey_raw = str(latest_data.get("rating_cycle_1_standard_survey_health_date") or "")
    last_survey_date = last_survey_raw.split(" ")[0] if last_survey_raw else "N/A"
    health_revisits = str(int(float(latest_data.get("rating_cycle_1_health_revisits") or 0)))

    total_penalties = str(int(float(latest_data['total_number_of_penalties'] or 0)))
    num_fines = str(int(float(latest_data['number_of_fines'] or 0)))

    # --- EXECUTIVE RISK & LEADERSHIP METRICS ---
    abuse_raw = str(latest_data.get("abuse_icon") or "").strip().upper()
    abuse_icon_val = "⚠️ Flagged" if abuse_raw == "Y" else "✓ Clear"
    abuse_color_class = "text-red" if abuse_raw == "Y" else "text-green"

    sff_raw = str(latest_data.get("special_focus_status") or "").strip()
    sff_val = sff_raw if sff_raw and sff_raw not in ["None", ""] else "Not in Program"

    admin_turnover = str(latest_data.get("num_administrators_left_nursing_home") or "0")
    if admin_turnover in ["None", "", "Not Available"]: admin_turnover = "0"

    rehospitalization = "N/A"
    ed_visits = "N/A"
    falls = "N/A"
    ulcers = "N/A"
    antipsychotic = "N/A"

    # Fetch Claims-Based Risk QMs (Rehospitalizations & ED Visits)
    try:
        claims_q = text("SELECT measure_description, adjusted_score FROM cleaned_nh_qualitymsr_claims WHERE cms_certification_number_ccn = :ccn AND report_month = :report_month")
        with engine.connect() as conn:
            for row in conn.execute(claims_q, {"ccn": ccn, "report_month": latest_date}).mappings():
                desc = str(row["measure_description"]).lower()
                score = row["adjusted_score"]
                if score and str(score).strip() not in ["", "Not Available", "No Data"]:
                    val = f"{float(score):.1f}%"
                    if "rehospitalized" in desc: rehospitalization = val
                    elif "outpatient ed" in desc or "emergency department" in desc: ed_visits = val
    except Exception: pass

    # Fetch MDS-Based Risk QMs (Litigation Triggers)
    uti_rate = "N/A"
    weight_loss = "N/A"
    catheter = "N/A"

    try:
        mds_q = text("SELECT measure_description, four_quarter_average_score FROM cleaned_nh_qualitymsr_mds WHERE cms_certification_number_ccn = :ccn AND report_month = :report_month")
        with engine.connect() as conn:
            for row in conn.execute(mds_q, {"ccn": ccn, "report_month": latest_date}).mappings():
                desc = str(row["measure_description"]).lower()
                score = row["four_quarter_average_score"]
                if score and str(score).strip() not in ["", "Not Available", "No Data"]:
                    val = f"{float(score):.1f}%"
                    
                    if "falls with major injury" in desc: falls = val
                    elif "pressure ulcer" in desc: ulcers = val
                    elif "antipsychotic" in desc and "long-stay" in desc: antipsychotic = val
                    elif "urinary tract infection" in desc or "uti" in desc: uti_rate = val
                    elif "lose too much weight" in desc or "weight loss" in desc: weight_loss = val
                    elif "catheter" in desc: catheter = val
    except Exception: pass

    # --- CHART.JS METRICS PREP ---
    chain_raw = latest_data.get("chain_name")
    chain_name = str(chain_raw).strip().replace("'", "") if chain_raw else "Independent Facility"
    
    def get_chart_val(val):
        return f"{float(val):.1f}" if val and str(val).strip() not in ["", "None", "N/A"] else "null"

    c_chain_ovr = get_chart_val(latest_data.get("chain_avg_overall_5_star_rating"))
    c_chain_hlth = get_chart_val(latest_data.get("chain_avg_health_inspection_rating"))
    c_chain_qm = get_chart_val(latest_data.get("chain_avg_qm_rating"))
    c_chain_stf = get_chart_val(latest_data.get("chain_avg_staffing_rating"))

    replacements = {
        "{{FACILITY_NAME}}": provider, 
        "{{LATEST_MONTH}}": str(latest_date), 
        "{{PREVIOUS_MONTH}}": str(previous_date),
        "{{OVERALL_RATING}}": overall_rating, 
        "{{STAR_SYMBOLS}}": star_symbols, 
        "{{OVERALL_TREND}}": overall_trend,
        "{{OVERALL_TREND_CLASS}}": overall_trend_class,
        "{{STATE_AVG}}": state_avg,
        "{{NAT_AVG}}": nat_avg,
        "{{STATE_ABBR}}": state_abbr,
        "{{HEALTH_SCORE}}": health_score, 
        "{{HEALTH_OFFSET}}": health_offset, 
        "{{HEALTH_TREND}}": health_trend,
        "{{HEALTH_TREND_CLASS}}": health_trend_class, 
        "{{STAFFING_SCORE}}": staffing_score, 
        "{{STAFFING_OFFSET}}": staffing_offset, 
        "{{STAFFING_TREND}}": staffing_trend,
        "{{STAFFING_TREND_CLASS}}": staffing_trend_class, 
        "{{QM_SCORE}}": qm_score, 
        "{{QM_OFFSET}}": qm_offset, 
        "{{QM_TREND}}": qm_trend,
        "{{QM_TREND_CLASS}}": qm_trend_class, 
        "{{TURNOVER_TOTAL}}": turnover_total, 
        "{{TURNOVER_RN}}": turnover_rn,
        "{{CERTIFIED_BEDS}}": beds, 
        "{{AVG_RESIDENTS}}": residents, 
        "{{HEALTH_DEFICIENCIES}}": health_def,
        "{{TOTAL_FINES}}": fines,

        # Acuity & Staffing Intensity Benchmarks & Trends
        "{{CMI}}": cmi_str,
        "{{CMI_TEXT}}": cmi_text,
        "{{CMI_CLASS}}": cmi_class,
        "{{CMI_COLOR_CLASS}}": cmi_color_class,
        "{{STATE_CMI}}": str(state_cmi_bm),
        "{{NAT_CMI}}": str(nat_cmi_bm),

        "{{WEEKEND_HRS}}": weekend_str,
        "{{WEEKEND_TEXT}}": weekend_text,
        "{{WEEKEND_CLASS}}": weekend_class,
        "{{WEEKEND_COLOR_CLASS}}": weekend_color_class,
        "{{STATE_WEEKEND}}": f"{state_wk_bm:.2f}",
        "{{NAT_WEEKEND}}": f"{nat_wk_bm:.2f}",

        "{{TOTAL_HRS_STR}}": total_str,
        "{{TOTAL_TEXT}}": total_text,
        "{{TOTAL_CLASS}}": total_class,
        "{{TOTAL_COLOR_CLASS}}": total_color_class,
        "{{STATE_TOTAL}}": f"{state_tot_bm:.2f}",
        "{{NAT_TOTAL}}": f"{nat_tot_bm:.2f}",

        "{{FIRE_DEF}}": fire_def_count,
        "{{TOTAL_PENALTIES}}": total_penalties,
        "{{NUM_FINES}}": num_fines,

        "{{VBP_SCORE}}": vbp_score,
        "{{VBP_MULT}}": vbp_mult,

        "{{ABUSE_ICON}}": abuse_icon_val,
        "{{ABUSE_COLOR_CLASS}}": abuse_color_class,
        "{{SFF_STATUS}}": sff_val,
        "{{ADMIN_TURNOVER}}": admin_turnover,
        "{{REHOSPITALIZATION}}": rehospitalization,
        "{{ED_VISITS}}": ed_visits,
        "{{FALLS}}": falls,
        "{{ULCERS}}": ulcers,
        "{{ANTIPSYCHOTIC}}": antipsychotic,

        "{{LPN_HRS}}": lpn_hrs,
        "{{CYC2_DEF}}": cyc2_def,
        "{{UTI_RATE}}": uti_rate,
        "{{WEIGHT_LOSS}}": weight_loss,
        "{{CATHETER}}": catheter,

        "{{STATE_STAFFING}}": state_staffing,
        "{{NAT_STAFFING}}": nat_staffing,
        "{{STATE_TOTAL_NURSE}}": state_total_hrs,
        "{{NAT_TOTAL_NURSE}}": nat_total_hrs,
        "{{STATE_RN_HRS}}": state_rn_hrs,
        "{{NAT_RN_HRS}}": nat_rn_hrs,

        "{{CHAIN_NAME}}": chain_name,
        "{{C_FAC_OVR}}": get_chart_val(overall_rating),
        "{{C_FAC_HLTH}}": get_chart_val(health_score),
        "{{C_FAC_QM}}": get_chart_val(qm_score),
        "{{C_FAC_LS}}": get_chart_val(ls_qm),
        "{{C_FAC_SS}}": get_chart_val(ss_qm),
        "{{C_FAC_STF}}": get_chart_val(staffing_score),
        
        "{{C_CHAIN_OVR}}": c_chain_ovr,
        "{{C_CHAIN_HLTH}}": c_chain_hlth,
        "{{C_CHAIN_QM}}": c_chain_qm,
        "{{C_CHAIN_STF}}": c_chain_stf,
        
        "{{C_STATE_OVR}}": get_chart_val(state_avg),
        "{{C_STATE_HLTH}}": state_health,
        "{{C_STATE_QM}}": state_qm,
        "{{C_STATE_STF}}": get_chart_val(state_staffing),
        
        "{{C_NAT_OVR}}": get_chart_val(nat_avg),
        "{{C_NAT_HLTH}}": nat_health,
        "{{C_NAT_QM}}": nat_qm,
        "{{C_NAT_STF}}": get_chart_val(nat_staffing),

        "{{LAST_SURVEY_DATE}}": last_survey_date,
        "{{HEALTH_REVISITS}}": health_revisits,

        "{{RN_HRS}}": rn_hrs, 
        "{{AIDE_HRS}}": aide_hrs, 
        "{{TOTAL_HRS}}": total_hrs_p2,
        "{{STD_DEF}}": std_def, 
        "{{COMP_DEF}}": comp_def, 
        "{{IC_DEF}}": ic_def,
        "{{LS_QM}}": ls_qm, 
        "{{SS_QM}}": ss_qm,
        "{{CCN}}": ccn,
        **trend_replacements
    }
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(base_dir, "template.html"), "r", encoding="utf-8") as f:
        html = f.read()
    with open(os.path.join(base_dir, "css", "style.css"), "r", encoding="utf-8") as f:
        css = f.read()

    html = html.replace("</head>", f"<style>\n{css}\n</style>\n</head>")

    for key, value in replacements.items():
        html = html.replace(key, str(value))

    temp_html = os.path.join(base_dir, f"temp_{ccn}.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html)

    file_url = f"file:///{temp_html.replace(os.sep, '/')}"
    output_pdf = os.path.join(base_dir, f"Executive_Newsletter_{ccn}.pdf")

    print(f"Rendering PDF for {provider}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_context().new_page()
        
        # Wait for assets to download
        page.goto(file_url, wait_until="networkidle")
        
        # Explicitly wait for the chart canvas to be recognized by the browser
        page.wait_for_selector("#starChart", state="attached")
        
        # Force a 5-second pause to guarantee Chart.js and fonts finish painting
        page.wait_for_timeout(5000) 
        
        page.pdf(
            path=output_pdf, width="11in", height="17in", print_background=True,
            margin={"top": "0in", "bottom": "0in", "left": "0in", "right": "0in"}
        )
        browser.close()

    if os.path.exists(temp_html):
        os.remove(temp_html)
    print(f"Success! Saved to {output_pdf}")

if __name__ == "__main__":
    generate_pdf("145696")