def my_context_processor(req):
    return {
        'domain_name': 'testtatter.com',
        'site_name': 'Tatter',
    }
