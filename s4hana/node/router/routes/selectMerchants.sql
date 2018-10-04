SELECT customer_id 
,case when customer_type is null then '' else left(customer_type, 30) end customer_type
,case when legal_type is null then '' else left(legal_type,50) end legal_type
,case when first_name is null then '' else left(first_name,35) end first_name
,case when last_name is null then '' else left(last_name,35) end last_name
,case when company_name is null then '' else left(company_name,35) end company_name
,case when country is null then '' else left(country,2) end country
,case when address_line_1 is null then '' else left(address_line_1,35) end address_line_1
,case when address_line_2 is null then '' else left(address_line_2,35) end address_line_2
,case when post_code is null then '' else left(post_code,10) end post_code
,case when region_name is null then '' else left(region_name,20) end region_name
,case when city is null then '' else left(city,35) end city
,case when email is null then '' else left(email,100) end email
,case when vat_number is null then '' else left(vat_number, 10) end vat_number
,case when tax_number is null then '' else left(tax_number,10) end tax_number
,case when sepa_mandate_id is null then '' else sepa_mandate_id end sepa_mandate_id
,case when iban is null then '' else iban end iban
,case when bic is null then '' else left(bic,10) end bic
,case when cpf is null then '' else '' end cpf -- Needs to be fixed for BR
,case when cnpj is null then '' else '' end cnpj -- Needs to be fixed for BR
,case when ie_number is null then '' else ie_number end ie_number
,case when cnae is null then '' else cnae end cnae
,case when legal_nature is null then '' else '' end legal_nature -- Needs to be fixed for BR
,case when crt_number is null then '' else crt_number end crt_number
,case when tax_declaration_type is null then '' else tax_declaration_type end tax_declaration_type
,case when pisconfis_declaration_regimen is null then '' else pisconfis_declaration_regimen end pisconfis_declaration_regimen
,case when mcc is null then '' else mcc end mcc
, to_char(signup_date::date, 'YYYY-MM-DD') as signup_date
, to_char(updated_at::date, 'YYYY-MM-DD') as updated_at
	 FROM reports.sap_customers  
	 where country = 'DE'