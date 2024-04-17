export interface SImbriefData {
    length: number;
    fetch:             Fetch;
    params:            Params;
    general:           General;
    origin:            Origin;
    destination:       Destination;
    alternate:         Alternate[];
    takeoff_altn:      any[];
    enroute_altn:      any[];
    navlog:            Navlog[];
    etops:             any[];
    atc:               Atc;
    aircraft:          Aircraft;
    fuel:              Fuel;
    fuel_extra:        FuelExtra;
    times:             Times;
    weights:           Weights;
    impacts:           Impacts;
    crew:              Crew;
    notams:            SImbriefDataNotam[];
    weather:           Weather;
    sigmets:           any[];
    text:              Text;
    tracks:            any[];
    database_updates:  DatabaseUpdates;
    files:             Files;
    fms_downloads:     FmsDownloads;
    images:            Images;
    links:             Links;
    prefile:           Prefile;
    vatsim_prefile:    string;
    ivao_prefile:      string;
    pilotedge_prefile: string;
    poscon_prefile:    string;
    map_data:          string;
    api_params:        { [key: string]: string };
}

export interface Aircraft {
    icaocode:       string;
    iatacode:       string;
    base_type:      string;
    icao_code:      string;
    iata_code:      string;
    name:           string;
    reg:            string;
    fin:            string;
    selcal:         string;
    equip:          string;
    fuelfact:       string;
    fuelfactor:     string;
    max_passengers: string;
    internal_id:    string;
    is_custom:      string;
}

export interface Alternate {
    icao_code:        string;
    iata_code:        string;
    faa_code:         string;
    icao_region:      string;
    elevation:        string;
    pos_lat:          string;
    pos_long:         string;
    name:             string;
    timezone:         string;
    plan_rwy:         string;
    trans_alt:        string;
    trans_level:      string;
    cruise_altitude:  string;
    distance:         string;
    gc_distance:      string;
    air_distance:     string;
    track_true:       string;
    track_mag:        string;
    tas:              string;
    gs:               string;
    avg_wind_comp:    string;
    avg_wind_dir:     string;
    avg_wind_spd:     string;
    avg_tropopause:   string;
    avg_tdv:          string;
    ete:              string;
    burn:             string;
    route:            string;
    route_ifps:       string;
    metar:            string;
    metar_time:       boolean;
    metar_category:   boolean;
    metar_visibility: boolean;
    metar_ceiling:    boolean;
    taf:              string;
    taf_time:         Date;
    atis:             any[];
    notam:            AlternateNotam[];
}

export interface AlternateNotam {
    source_id:                string;
    account_id:               string;
    notam_id:                 string;
    location_id:              string;
    location_icao:            string;
    location_name:            string;
    location_type:            string;
    date_created:             Date;
    date_effective:           Date;
    date_expire:              Date;
    date_expire_is_estimated: boolean;
    date_modified:            Date;
    notam_schedule:           string;
    notam_html:               string;
    notam_text:               string;
    notam_raw:                string;
    notam_nrc:                string;
    notam_qcode:              string;
    notam_qcode_category:     string;
    notam_qcode_subject:      string;
    notam_qcode_status:       string;
    notam_is_obstacle:        boolean;
}

export interface Atc {
    flightplan_text:  string;
    route:            string;
    route_ifps:       string;
    callsign:         string;
    initial_spd:      string;
    initial_spd_unit: string;
    initial_alt:      string;
    initial_alt_unit: string;
    section18:        string;
    fir_orig:         string;
    fir_dest:         string;
    fir_altn:         string[];
    fir_etops:        any[];
    fir_enroute:      any[];
}

export interface Crew {
    pilot_id: string;
    cpt:      string;
    fo:       string;
    dx:       string;
    pu:       string;
    fa:       string[];
}

export interface DatabaseUpdates {
    metar_taf: Date;
    winds:     Date;
    sigwx:     Date;
    sigmet:    Date;
    notams:    Date;
    tracks:    Date;
}

export interface Destination {
    icao_code:        string;
    iata_code:        string;
    faa_code:         string;
    icao_region:      string;
    elevation:        string;
    pos_lat:          string;
    pos_long:         string;
    name:             string;
    timezone:         string;
    plan_rwy:         string;
    trans_alt:        string;
    trans_level:      string;
    metar:            string;
    metar_time:       Date;
    metar_category:   string;
    metar_visibility: string;
    metar_ceiling:    string;
    taf:              string;
    taf_time:         Date;
    atis:             any[];
    notam:            any[];
}

export interface Fetch {
    userid:    string;
    static_id: string;
    status:    string;
    time:      string;
}

export interface Files {
    directory: string;
    pdf:       PDF;
    file:      PDF[];
}

export interface PDF {
    name: string;
    link: string;
}

export interface FmsDownloads {
    directory: string;
    pdf:       PDF;
    abx:       PDF;
    a3e:       PDF;
    crx:       PDF;
    cra:       PDF;
    psx:       PDF;
    efb:       PDF;
    ef2:       PDF;
    bbs:       PDF;
    csf:       PDF;
    ftr:       PDF;
    gtn:       PDF;
    vm5:       PDF;
    vmx:       PDF;
    ffa:       PDF;
    fsc:       PDF;
    fs9:       PDF;
    mfs:       PDF;
    mfn:       PDF;
    fsl:       PDF;
    fsx:       PDF;
    fsn:       PDF;
    kml:       PDF;
    ify:       PDF;
    i74:       PDF;
    ifa:       PDF;
    inb:       PDF;
    ivo:       PDF;
    xvd:       PDF;
    xvp:       PDF;
    ixg:       PDF;
    jar:       PDF;
    jhe:       PDF;
    jfb:       PDF;
    mdr:       PDF;
    mda:       PDF;
    lvd:       PDF;
    mjc:       PDF;
    mjq:       PDF;
    atm:       PDF;
    mvz:       PDF;
    vms:       PDF;
    pmo:       PDF;
    pmr:       PDF;
    pmw:       PDF;
    pgt:       PDF;
    mga:       PDF;
    psm:       PDF;
    qty:       PDF;
    rmd:       PDF;
    sbr:       PDF;
    sfp:       PDF;
    tdg:       PDF;
    tfd:       PDF;
    ufc:       PDF;
    vas:       PDF;
    vfp:       PDF;
    wae:       PDF;
    xfm:       PDF;
    xpe:       PDF;
    xpn:       PDF;
    xp9:       PDF;
    zbo:       PDF;
}

export interface Fuel {
    taxi:           string;
    enroute_burn:   string;
    contingency:    string;
    alternate_burn: string;
    reserve:        string;
    etops:          string;
    extra:          string;
    extra_required: string;
    extra_optional: string;
    min_takeoff:    string;
    plan_takeoff:   string;
    plan_ramp:      string;
    plan_landing:   string;
    avg_fuel_flow:  string;
    max_tanks:      string;
}

export interface FuelExtra {
    bucket: Bucket[];
}

export interface Bucket {
    label:    string;
    fuel:     string;
    time:     string;
    required: boolean;
}

export interface General {
    release:             string;
    icao_airline:        string;
    flight_number:       string;
    is_etops:            string;
    dx_rmk:              string[];
    sys_rmk:             any[];
    is_detailed_profile: string;
    cruise_profile:      string;
    climb_profile:       string;
    descent_profile:     string;
    alternate_profile:   string;
    reserve_profile:     string;
    costindex:           string;
    cont_rule:           string;
    initial_altitude:    string;
    stepclimb_string:    string;
    avg_temp_dev:        string;
    avg_tropopause:      string;
    avg_wind_comp:       string;
    avg_wind_dir:        string;
    avg_wind_spd:        string;
    gc_distance:         string;
    route_distance:      string;
    air_distance:        string;
    total_burn:          string;
    cruise_tas:          string;
    cruise_mach:         string;
    passengers:          string;
    route:               string;
    route_ifps:          string;
    route_navigraph:     string;
}

export interface Images {
    directory: string;
    map:       PDF[];
}

export interface Impacts {
    minus_6000ft:   HigherCi;
    minus_4000ft:   HigherCi;
    minus_2000ft:   HigherCi;
    plus_2000ft:    any[];
    plus_4000ft:    any[];
    plus_6000ft:    any[];
    higher_ci:      HigherCi;
    lower_ci:       HigherCi;
    zfw_plus_1000:  HigherCi;
    zfw_minus_1000: HigherCi;
}

export interface HigherCi {
    time_enroute:    string;
    time_difference: string;
    enroute_burn:    string;
    burn_difference: string;
    ramp_fuel:       string;
    initial_fl:      string;
    initial_tas:     string;
    initial_mach:    string;
    cost_index:      string;
}

export interface Links {
    skyvector: string;
}

export interface Navlog {
    ident:             string;
    name:              string;
    type:              string;
    icao_region:       string;
    frequency:         string;
    pos_lat:           string;
    pos_long:          string;
    stage:             string;
    via_airway:        string;
    is_sid_star:       string;
    distance:          string;
    track_true:        string;
    track_mag:         string;
    heading_true:      string;
    heading_mag:       string;
    altitude_feet:     string;
    ind_airspeed:      string;
    true_airspeed:     string;
    mach:              string;
    mach_thousandths:  string;
    wind_component:    string;
    groundspeed:       string;
    time_leg:          string;
    time_total:        string;
    fuel_flow:         string;
    fuel_leg:          string;
    fuel_totalused:    string;
    fuel_min_onboard:  string;
    fuel_plan_onboard: string;
    oat:               string;
    oat_isa_dev:       string;
    wind_dir:          string;
    wind_spd:          string;
    shear:             string;
    tropopause_feet:   string;
    ground_height:     string;
    mora:              string;
    fir:               string;
    fir_units:         string;
    fir_valid_levels:  string;
    wind_data:         WindDatum[];
    fir_crossing:      any[];
}

export interface WindDatum {
    altitude: string;
    wind_dir: string;
    wind_spd: string;
    oat:      string;
}

export interface SImbriefDataNotam {
    source_id:                   string;
    account_id:                  string;
    notam_id:                    string;
    notam_part:                  string;
    cns_location_id:             string;
    icao_id:                     string;
    icao_name:                   string;
    total_parts:                 string;
    notam_created_dtg:           string;
    notam_effective_dtg:         string;
    notam_expire_dtg?:           string;
    notam_lastmod_dtg:           string;
    notam_inserted_dtg:          string;
    notam_text:                  string;
    notam_report:                string;
    notam_nrc:                   string;
    notam_qcode:                 string;
    notam_expire_dtg_estimated?: string;
}

export interface Origin {
    icao_code:        string;
    iata_code:        string;
    faa_code:         string;
    icao_region:      string;
    elevation:        string;
    pos_lat:          string;
    pos_long:         string;
    name:             string;
    timezone:         string;
    plan_rwy:         string;
    trans_alt:        string;
    trans_level:      string;
    metar:            string;
    metar_time:       boolean;
    metar_category:   boolean;
    metar_visibility: boolean;
    metar_ceiling:    boolean;
    taf:              string;
    taf_time:         Date;
    atis:             any[];
    notam:            AlternateNotam[];
}

export interface Params {
    request_id:     string;
    user_id:        string;
    time_generated: Date;
    static_id:      string;
    xml_file:       string;
    ofp_layout:     string;
    airac:          string;
    units:          string;
}

export interface Prefile {
    vatsim:    Ivao;
    ivao:      Ivao;
    pilotedge: Ivao;
    poscon:    Ivao;
}

export interface Ivao {
    name: string;
    site: string;
    link: string;
    form: string;
}

export interface Text {
    nat_tracks: string;
    plan_html:  string;
}

export interface Times {
    est_time_enroute:   string;
    sched_time_enroute: string;
    sched_out:          Date;
    sched_off:          Date;
    sched_on:           Date;
    sched_in:           Date;
    sched_block:        string;
    est_out:            Date;
    est_off:            Date;
    est_on:             Date;
    est_in:             Date;
    est_block:          string;
    orig_timezone:      string;
    dest_timezone:      string;
    taxi_out:           string;
    taxi_in:            string;
    reserve_time:       string;
    endurance:          string;
    contfuel_time:      string;
    etopsfuel_time:     string;
    extrafuel_time:     string;
}

export interface Weather {
    orig_metar:   string;
    orig_taf:     string;
    dest_metar:   string;
    dest_taf:     string;
    altn_metar:   string[];
    altn_taf:     string[];
    toaltn_metar: string;
    toaltn_taf:   string;
    eualtn_metar: string;
    eualtn_taf:   string;
    etops_metar:  any[];
    etops_taf:    any[];
}

export interface Weights {
    oew:              string;
    pax_count:        string;
    bag_count:        string;
    pax_count_actual: string;
    bag_count_actual: string;
    pax_weight:       string;
    bag_weight:       string;
    freight_added:    string;
    cargo:            string;
    payload:          string;
    est_zfw:          string;
    max_zfw:          string;
    est_tow:          string;
    max_tow:          string;
    max_tow_struct:   string;
    tow_limit_code:   string;
    est_ldw:          string;
    max_ldw:          string;
    est_ramp:         string;
}
