import os
import numpy as np

from skyportal.tests import api


def test_gcn_GW(super_admin_token, view_only_token):

    datafile = f'{os.path.dirname(__file__)}/../data/GW190425_initial.xml'
    with open(datafile, 'rb') as fid:
        payload = fid.read()
    data = {'xml': payload}

    status, data = api('POST', 'gcn_event', data=data, token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'

    dateobs = "2019-04-25 08:18:05"
    params = {"include2DMap": True}

    status, data = api('GET', f'gcn_event/{dateobs}', token=super_admin_token)
    assert status == 200
    data = data["data"]
    assert data["dateobs"] == "2019-04-25T08:18:05"
    assert 'GW' in data["tags"]

    skymap = "bayestar.fits.gz"
    status, data = api(
        'GET',
        f'localization/{dateobs}/name/{skymap}',
        token=super_admin_token,
        params=params,
    )

    data = data["data"]
    assert data["dateobs"] == "2019-04-25T08:18:05"
    assert data["localization_name"] == "bayestar.fits.gz"
    assert np.isclose(np.sum(data["flat_2d"]), 1)

    status, data = api(
        'DELETE',
        f'localization/{dateobs}/name/{skymap}',
        token=view_only_token,
    )
    assert status == 400

    status, data = api(
        'DELETE',
        f'localization/{dateobs}/name/{skymap}',
        token=super_admin_token,
    )
    assert status == 200


def test_gcn_Fermi(super_admin_token, view_only_token):

    datafile = f'{os.path.dirname(__file__)}/../data/GRB180116A_Fermi_GBM_Gnd_Pos.xml'
    with open(datafile, 'rb') as fid:
        payload = fid.read()
    data = {'xml': payload}

    status, data = api('POST', 'gcn_event', data=data, token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'

    dateobs = "2018-01-16 00:36:53"
    params = {"include2DMap": True}

    status, data = api('GET', f'gcn_event/{dateobs}', token=super_admin_token)
    assert status == 200
    data = data["data"]
    assert data["dateobs"] == "2018-01-16T00:36:53"
    assert 'GRB' in data["tags"]

    skymap = "214.74000_28.14000_11.19000"
    status, data = api(
        'GET',
        f'localization/{dateobs}/name/{skymap}',
        token=super_admin_token,
        params=params,
    )

    data = data["data"]
    assert data["dateobs"] == "2018-01-16T00:36:53"
    assert data["localization_name"] == "214.74000_28.14000_11.19000"
    assert np.isclose(np.sum(data["flat_2d"]), 1)

    status, data = api(
        'DELETE',
        f'localization/{dateobs}/name/{skymap}',
        token=view_only_token,
    )
    assert status == 400

    status, data = api(
        'DELETE',
        f'localization/{dateobs}/name/{skymap}',
        token=super_admin_token,
    )
    assert status == 200


def test_gcn_IPN(super_admin_token, view_only_token):

    skymap = f'{os.path.dirname(__file__)}/../data/GRB220617A_IPN_map_hpx.fits.gz'
    dateobs = '2022-06-17T18:31:12'
    tags = ['IPN', 'GRB']

    data = {'dateobs': dateobs, 'skymap': skymap, 'tags': tags}

    status, data = api('POST', 'gcn_event', data=data, token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'

    dateobs = "2022-06-17 18:31:12"
    status, data = api('GET', f'gcn_event/{dateobs}', token=super_admin_token)
    assert status == 200
    data = data["data"]
    assert data["dateobs"] == "2022-06-17T18:31:12"
    assert 'IPN' in data["tags"]
