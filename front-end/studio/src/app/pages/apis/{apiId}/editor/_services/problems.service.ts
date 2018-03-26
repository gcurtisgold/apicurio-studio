/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {Injectable} from "@angular/core";
import {OasValidationError} from "oai-ts-core";



var PROBLEM_EXPLANATIONS = {
    // OpenAPI 2.0 Problems
    "CTC-001"  : `If a URL is specified for the Contact information, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "CTC-002"  : `If an email address is specified for the Contact, it must be a valid email format.  Make sure the value supplied is formatted properly.`,
    "ED-002"   : `The description of the External Documentation must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "ED-003"   : `If a URL is specified for the External Documentation, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "HEAD-005" : `The default value provided for the Header does not match its type.  For example, if the type of the Header is "integer", any default value must actually be a valid integer.`,
    "INF-003"  : `The description of the API must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "IT-007"   : `The default value provided for the parameter's items does not match its type.  For example, if the type of the type is "integer", any default value must actually be a valid integer.`,
    "LIC-002"  : `If a URL is specified for the License, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "OP-002"   : `The description of the Operation must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "OP-005"   : `When you indicate that an Operation consumes a particular type of data, you must provide a valid mime-type.  Examples of valid mime types include:  text/plain, application/json, application/x-www-form-urlencoded.`,
    "OP-006"   : `When you indicate that an Operation produces a particular type of data, you must provide a valid mime-type.  Examples of valid mime types include:  text/plain, application/json, application/pdf.`,
    "PAR-010"  : `The description of the Parameter must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "R-004"    : `The provided Host information was invalid.  Only the host name (and optionally port) should be included.  An IP address is not allowed, nor is a URL.  Examples of a valid host include "localhost", "api.example.org", and "api.example.org:8080".`,
    "R-005"    : `When providing a Base Path for the API, it must start with a '/' character.  The Base Path is appended to the Scheme and Host information to form a full URL to the API.`,
    "SS-011"   : `An OAuth Security Scheme defintion may include an "Authorization URL".  When included, it must be a valid URL format (including scheme, host, port, and path).`,
    "SS-012"   : `An OAuth Security Scheme defintion may include a "Token URL".  When included, it must be a valid URL format (including scheme, host, port, and path).`,
    "TAG-002"  : `The description of the Tag must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "XML-001"  : `When defining the XML format of a definition, the Namespace must be a valid XML URI/URL.  Check the value and make sure it's a valid XML Namespace URL format.`,
    "EX-001"   : `When defining examples for an Operation Response, each example must correspond to one of the mime-types defined by the Operation.  Note that the Operation can declare its own mime-types (via the "produces" property of the Operation) OR it can inherit the mime-types from the API's global "produces" property.`,
    "PATH-005" : `Every path defined by the API must begin with a '/' character.  Paths are appended to the API URL to uniquely identify an endpoint for the API.`,
    "PDEF-001" : ``,
    "RDEF-001" : ``,
    "RES-003"  : `All Responses declared for an Operation must correspond to a valid HTTP response status code.  Valid status codes are things like 200, 404, 500.  A full list of status codes can be found here:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml`,
    "SCPS-001" : ``,
    "SDEF-001" : ``,
    "SS-013"   : ``,
    "HEAD-003" : `When declaring a Header you must identify the Header's type.  Valid types for Headers include: string, number, integer, boolean, array.  Any other value (or no value at all) is not allowed.`,
    "HEAD-004" : `When declaring a Header, the Header type can be further refined by indicating a "format".  Valid formats for Headers include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat`,
    "HEAD-006" : `Only Headers that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).`,
    "HEAD-007" : `When indicating a Collection Format for a Header, the only valid values are: csv, ssv, tsv, pipes`,
    "IT-003"   : `For Parameters that are of type "array", the declarating of the Parameter's Items must indicate a type.  This is required so that consumers know what type of data each item of the array must be.  Valid values are: string, number, integer, boolean, array`,
    "IT-004"   : `When defining the type of an array-type parameter's items, the type can be further refined by indicating a "format".  Valid formats for parameter Items include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat`,
    "IT-005"   : `When indicating a Collection Format for an array-style Parameter, the only valid values are: csv, ssv, tsv, pipes`,
    "IT-006"   : `Only Parameters that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).`,
    "OP-001"   : `When defining a summary for an Operation, it should be short and descriptive, limited to 120 characters.`,
    "OP-004"   : `Every operation may optionally have an operationId property.  If declared, it should follow standard software programming style (e.g. camelCase).  It must also be unique over all Operations in the API.`,
    "OP-010"   : `When declaring the valid schemes for an Operation, the only valid options are:  http, https, ws, wss`,
    "PAR-007"  : `All Path Parameters must have a name that maps to one of the dynamic elements of the path's template.  For example, if the path template is "/items/{itemId}/widgets/{widgetId}" then the only valid values for Path Paramter names are "itemId" and "widgetId".`,
    "PAR-008"  : `When using Form Data as the input to an Operation, the Operation must indicate that it can consume form data by listing either "application/x-www-form-urlencoded" or "multipart/form-data" in its list of Consumes mime-types.`,
    "PAR-009"  : `Every parameter must be located in one of the following locations:  URL Query Params, HTTP Headers, the Path Template, Form Data, or the HTTP Request Body.  Therefore, the "in" property for any Parameter must be one of:  query, header, path, formData, body.  Make sure your parameter doesn't mistakenly indicate some other value.`,
    "PAR-011"  : `When declaring a Parameter you must identify its type.  Valid types for Parameters include: string, number, integer, boolean, array, file.  Any other value (or no value at all) is not allowed.`,
    "PAR-012"  : `When defining a Parameter's type, it can be further refined by indicating a "format".  Valid formats for parameters include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat`,
    "PAR-013"  : `You can only indicate that empty values are allowed for Parameters that are in the query or in form data.  Other parameters (such as in headers or in the path) cannot be empty.`,
    "PAR-014"  : `Only Parameters that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).`,
    "PAR-015"  : `When indicating a Collection Format for an array-style Parameter, the only valid values are: csv, ssv, tsv, pipes, multi`,
    "PAR-016"  : `When specifying "multi" as the collection format for a Parameter, the Parameter must be either a Query Param or a Parameter in the Form Data.  This is because only those types of parameters support passing multiple values for a single name.`,
    "PAR-017"  : `If a Parameter is marked as "required", then no default value is allowed.  Because a default value is only used when the API consumer invokes the Operation without the Parameter, default values don't make sense for required Parameters.`,
    "R-006"    : `When indicating the default schemes supported by the API, only the following are valid choices: http, https, ws, wss`,
    "R-007"    : `When indicating the default data formats that the API consumes, the values must be valid mime-types.  Examples of valid mime types include:  text/plain, application/json, application/x-www-form-urlencoded.`,
    "R-008"    : `When indicating the default data formats that the API produces, the values must be valid mime-types.  Examples of valid mime types include:  text/plain, application/json, application/pdf.`,
    "SREQ-002" : `Security Requirements can be specified for basic, apiKey, or oauth.  When using basic or apiKey authentication, the security requirement must NOT provide a list of scopes (the list of scopes must be empty).  In other words, scopes are only valid when using OAuth 2 authentication.`,
    "SREQ-003" : `Security Requirements can be specified for basic, apiKey, or oauth.  When using OAuth 2 authentication, the security requirement MUST provide the list of scopes required for the caller to successfully access the API.`,
    "SS-008"   : `The OpenAPI specification only supports the following authentication types:  Basic, API Key, and OAuth 2.  Any other authentication types are not valid.  As a result, the value of "in" for a Security Scheme must be one of: basic, apiKey, oauth2`,
    "SS-009"   : `The only valid values for the "in" property of a Security Schema are: query, header.  This property indicates where in the Request the security token can be found (either in HTTP Request Headers or in the URL Query Parameters).`,
    "SS-010"   : `When using OAuth 2 authentication, the OAuth flow must be defined and it must be one of the possible supported OAuth flows.  The supported flows are:  implicit, password, application, and accessCode`,
    "XML-002"  : `When defining the XML representation of a definition, one of the options is to declare an element must be wrapped (by another XML element).  However, this is only relevant for "array" type properties, since array properties may have multiple values that should be contained within a parent (wrapper) XML element.`,
    "PAR-018"  : `The definition of the Parameter attempts to reference a Parameter found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Parameter was deleted, or there is a typo in the reference.`,
    "PATH-001" : `A Path Item was defined as a reference to an external document, but that document could not be found  (or the referenced Path Item within it could not be found).`,
    "RES-002"  : `The definition of the Response attempts to reference a Response found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Response was deleted, or there is a typo in the reference.`,
    "SCH-001"  : `The definition of the Schema attempts to reference a type Definition found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Definition was deleted, or there is a typo in the reference.`,
    "SREQ-001" : `The names of each security requirement declared for an Operation (or declared globally) must match the name of a globally defined Security Scheme.  Check to make sure that the names of the requirement match up with security schemes previously defined.`,
    "OP-009"   : `It is not possible to use Body and Form Data parameters in the same Operation.  These input types are mutually exclusive, since both are sent via the HTTP Request's body.`,
    "PATH-004" : `It is not possible to use Body and Form Data parameters in the same Operation.  These input types are mutually exclusive, since both are sent via the HTTP Request's body.`,
    "ED-001"   : `When defining your External Documentation, you must provide a URL!`,
    "HEAD-001" : `You need to specify a type when defining a Header.  Valid Header types include: string, number, integer, boolean, array.`,
    "INF-001"  : `The API must have a title provided.`,
    "INF-002"  : `The API must have a version provided.`,
    "IT-001"   : `When defining the items of an array-type Parameter, the type of the items MUST be indicated.  Please make sure you define the type of items for your array-type Parameter.`,
    "LIC-001"  : `When including License information for the API, a Name of the License is required (cannot be blank).`,
    "OP-007"   : `When declaring an Operation (e.g. GET, PUT, POST, etc...) at least one Response MUST be included.  Typically at least a 20x (success) response should be defined.`,
    "PAR-001"  : `All Parameters, regardless of location (query, path, form data) MUST include a name.  Parameters are uniquely identified by the combination of "in" (what kind of parameter it is such as query or path) and "name".`,
    "PAR-002"  : `Every Parameter must indicate what kind it is, by providing a value for the "in" property.  Value values include: query, formData, path, body.`,
    "R-001"    : `Every OpenAPI (version 2.0) document MUST include the root "swagger" property, and its value MUST be "2.0".`,
    "R-002"    : `Every OpenAPI document MUST include some basic information such as Name and Version.  This meta-data is contained in an "info" root property.  Please make sure to add this information to the API.`,
    "R-003"    : `The OpenAPI document must have at least one path defined.  Without any paths, consumers have no endpoints/operations to invoke.  Make sure to add at least one Path.  For example:  "/items/{itemId}"`,
    "RES-001"  : `Every Response (in each Operation) must have a description.  Please make sure to add a helpful description to your Responses.`,
    "SS-001"   : `When defining a Security Scheme, a type must be provided.  Possible security scheme types include: basic, apiKey, oauth2`,
    "TAG-001"  : `Tags defined in the OpenAPI document must each have a name (and the name must be unique).  Please make sure each tag defined has a name.`,
    "HEAD-002" : `Whenever a Header is declared to be of type "array", the array's items must also be identified.  This manifests as a "items" property in the specification.  Please make sure to indicate what type the Header's array items must be.`,
    "IT-002"   : `Whenever a Parameter is declared to be of type "array", the array's items must also be identified.  This manifests as a "items" property in the specification.  Please make sure to indicate what type the Parameter's array items must be.`,
    "PAR-003"  : `Path style Parameters (dynamic parameters found in the path template of an endpoint) are always required.  Therefore the "required" property must be included for all Path Parameters, and its value must be true.`,
    "PAR-004"  : `When declaring a request body style Parameter, a schema must be provided in order to declare the type of data expected in the body.`,
    "PAR-005"  : `You must define the type of the parameter!  Possible parameter types include string, number, integer, boolean, array.`,
    "PAR-006"  : `Whenever a Parameter is declared to be of type "array", the array's items must also be identified.  This manifests as a "items" property in the specification.  Please make sure to indicate what type the Parameter's array items must be.`,
    "SS-002"   : `When using API Key style authentication, the "name" property must be declared to indicate where to find the key information.  The API Key must be passed in the request, either in an HTTP Header or as a Query Parameter.  In both cases, the name of the Header or Parameter must be declared.`,
    "SS-003"   : `When using API Key style authentication, the "name" property must be declared to indicate where to find the key information.  The API Key must be passed in the request, either in an HTTP Header or as a Query Parameter.  Therefore, possible values are: query, header`,
    "SS-004"   : `When using OAuth 2 as the authentication style, the "flow" property must be defined.  This property is used to indicate the precise OAuth 2 flow supported by the API.  Valid values for this property are: implicit, password, application, accessCode`,
    "SS-005"   : `When using OAuth 2 authentication's Implicit or Access Code flows, you must provide a valid Authorization URL.  The Authorization URL is required in order to properly implement the Implicit or Access Code OAuth 2 flows.`,
    "SS-006"   : `When using OAuth 2 authentication's Password, Application, or Access Code flows, you must provide a valid Token URL.  The Token URL is required in order to properly implement any of these flows.`,
    "SS-007"   : `Whenever OAuth 2 is used as the authentication method, a set of scopes must be defined.  Make sure you have a list of scopes configured for all OAuth 2 security schemes.`,
    "OP-003"   : `Each operation may have an optional "operationId" defined for it.  This ID must be unique across all operations in the API.`,
    "PAR-019"  : `Parameters are uniquely defined by their "name" and their "location" (path, query, formData, etc).  You cannot have two Parameters with the same combination of name and location.  Please make sure that all of your parameters are appropriately unique based on these two criteria.`,
    "PAR-020"  : `Only a single "body" parameter may be defined for an Operation.  A body parameter indicates that the operation expects to receive input (typically some JSON data) in the body of the HTTP request.  Since there is only one request body, only one paramet of this type can be specified.`,
    "TAG-003"  : `It was found that two (or more) tags have the same name.  Every tag in the document must have a unique name (different from all other tag names).`,

    // OpenAPI 3.0.x Problems
    "HEAD-3-001" : `When defining headers, most header names except for "Content-Type" are allowed.  However, "Content-Type" will be ignored because it is already specified in the definition of the Response's Content.`,
    "CTC-3-001"  : `If a URL is specified for the Contact information, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "CTC-3-002"  : `If an email address is specified for the Contact, it must be a valid email format.  Make sure the value supplied is formatted properly.`,
    "ED-3-001"   : `The description of the External Documentation must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "ED-3-003"   : `If a URL is specified for the External Documentation, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "EX-3-001"   : `The description of the Example must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "FLOW-3-003" : `If an Authorization URL is specified for an OAuth Flow, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "FLOW-3-004" : `If an Token URL is specified for an OAuth Flow, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "FLOW-3-005" : `If an Refresh URL is specified for an OAuth Flow, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "HEAD-3-002" : `The description of the Header must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "INF-3-003"  : `The description of the API must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "INF-3-004"  : `If a URL for the API's "Terms & Services" is specified, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "LIC-3-002"  : `If a License URL is specified, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "LINK-3-004" : `The description of the Link must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "OP-3-001"   : `The description of the Operation must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "PAR-3-005"  : `The description of the Parameter must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "PATH-3-003" : `The description of the Path Item must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "RB-3-001"   : `The description of the Request Body must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "RES-3-002"  : `The description of the Response must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "SRV-3-002"  : `The Server URL must be a valid URL template.  A URL template is composed of regular text plus any number of Server Variable replacements.  When evaluated, the result must be a valid URL.`,
    "SRV-3-003"  : `The description of the Server Variable must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "SS-3-007"   : `When using an OpenId Connect Security Scheme, the "Open ID Connect URL" must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!`,
    "SS-3-009"   : `The description of the Security Scheme must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "SVAR-3-002" : `The description of the Server Variable must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "TAG-3-002"  : `The description of the Tag must be in either plain text or CommonMark (http://commonmark.org/) format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).`,
    "XML-3-001"  : `When defining the XML format of a definition, the Namespace must be a valid XML URI/URL.  Check the value and make sure it's a valid XML Namespace URL format.`,
    "COMP-3-001" : `When creating re-usable Schema Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-002" : `When creating re-usable Parameter Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-003" : `When creating re-usable Response Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-004" : `When creating re-usable Security Schemes, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-005" : `When creating re-usable Example Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-006" : `When creating re-usable Request Body Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-007" : `When creating re-usable Header Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-008" : `When creating re-usable Link Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "COMP-3-009" : `When creating re-usable Callback Definitions, the names you give them must conform to a simple pattern.  Only letters, numbers, and the . (period), - (dash), and _ (underscore) characters are allowed.`,
    "ENC-3-006"  : `The defined encoding property is used to further describe how to encode one of the properties of a schema (when sending data to an Operation within a Request Body).  Therefore the encoding property must match one of the properties specified in the schema.`,
    "PATH-3-004" : `All path templates must begin with a '/' (forward slash) character.`,
    "RES-3-001"  : `All responses must be mapped to valid HTTP response codes.  Note that response code patterns are valid (such as 4XX to indicate all response codes in the 400 range).  You can also use the special response code keyword "default" to match all response codes.  You can find the list of valid response codes here:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml`,
    "SREQ-3-001" : `When specifying security requirements for e.g. operations, each security requirement must correspond to one of the defined Security Schemes.  Check the list of Security Schemes to see if there is one that matches the name of the Security Requirement.`,
    "ENC-3-001"  : `You can only specify headers in your Encodings for "multipart" Media Types.  This is the only scenario where HTTP headers make sense for a specific property and its encoding.`,
    "ENC-3-002"  : `The Encoding style is only relevant for "application/x-www-form-urlencoded" Media Types.  The style is needed to determine just how the encoding property is expected to be formatted within the HTTP request's form content.`,
    "ENC-3-003"  : `The "explode" option for an Encoding is only relevant for "application/x-www-form-urlencoded" Media Types.  This option is needed to determine just how the encoding property is expected to be formatted within the HTTP request's form content.  When this is true, property values of type "array" or "object" generate separate parameters for each value of the array, or key-value-pair of the map.`,
    "ENC-3-004"  : `The "allowReserved" option for an Encoding is only relevant for "application/x-www-form-urlencoded" Media Types.  This option is needed to determine just how the encoding property is expected to be formatted within the HTTP request's form content.  Setting the "explode" option determines whether the parameter value SHOULD allow reserved characters (as defined by RFC3986) to be included without percent-encoding.`,
    "ENC-3-005"  : `The only valid options for the Encoding Style are "form", "spaceDelimited", "pipeDelimited", and "deepObject".  For explanations of each option, go here: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#style-values`,
    "HEAD-3-003" : `When defining a Header, the "style" property MUST have a value of "simple".  This is currently the only supported style option for Header style parameters.`,
    "HEAD-3-004" : `When specifying the Content of a Header, only one Media Type can be defined.  Unlike Request Body content and Response content, a Header can only support a single content media type.`,
    "LINK-3-002" : `A Link can refer to an Operation either by reference or by operation ID.  When using the latter approach, the API must contain an operation with that ID.  Make sure you have an operation defined with an appropriate ID.`,
    "MT-3-003"   : `Content "Encoding" options are only supported when the Request Body Media Type is either a multi-part type or "application/x-www-form-urlencoded".  For other content types (e.g. application/json), the concept of encoding the schema properties doesn't make sense.`,
    "OP-3-003"   : `The HTTP specification only supports a body in the HTTP request for the POST, PUT, and OPTIONS methods.  As a result, only these operations may define a Request Body input.`,
    "OP-3-005"   : `Every Operation defined in the API must include at least one Response, so that consumers know what data to expect back as a result of performing the operation.`,
    "PAR-3-002"  : `When defining a Parameter, you must indicate where in the HTTP request the parameter can be found.  The possible values are "path", "query', "header", and "cookie".`,
    "PAR-3-006"  : `All "path" style Parameters must define the "required" property and the value of this property must be "true".`,
    "PAR-3-007"  : `The "allowEmptyValue" option for a parameter only makes sense for "query" style parameters.  This option indicates whether the client can send an empty value for the parameter (something that is only possible for query parameters).`,
    "PAR-3-009"  : `The "style" property of a Parameter describes how the parameter value will be serialized depending on the type of the parameter value.  The only allowed values are "matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", and "deepObject".`,
    "PAR-3-010"  : `The "style" property of a Parameter describes how the parameter value will be serialized depending on the type of the parameter value.  When the parameter is found in the path, the only allowed values are "matrix", "label", and "simple".`,
    "PAR-3-011"  : `The "style" property of a Parameter describes how the parameter value will be serialized depending on the type of the parameter value.  When the parameter is found in the query, the only allowed values are "form", "spaceDelimited", "pipeDelimited", and "deepObject".`,
    "PAR-3-012"  : `The "style" property of a Parameter describes how the parameter value will be serialized depending on the type of the parameter value.  When the parameter is a Cookie, the only allowed value is "form".`,
    "PAR-3-013"  : `The "style" property of a Parameter describes how the parameter value will be serialized depending on the type of the parameter value.  When the parameter is an HTTP Header, the only allowed value is "simple".`,
    "PAR-3-014"  : `The "allowReserved" option for Parameters determines whether the parameter value should allow reserved characters (as defined by RFC3986) to be included without percent-encoding.  This property is only relevant for query parameters (because only query parameters require percent encoding).`,
    "PAR-3-016"  : `When specifying the Content of a Parameter, only one Media Type can be defined.  Unlike Request Body content and Response content, a Parameter can only support a single content media type.`,
    "PAR-3-018"  : `For path style parameters, the name of the parameter must correspond to one of the variables defined in the path template.  For example, if the path template is "/resource/{resourceId}/{resourceType}", then the name of the path parameter must be either "resourceId" or "resourceType".`,
    "PAR-3-019"  : `Because these specific HTTP headers are defined separately within the API definition, header style parameters named "Accept", "Content-Type", and "Authorization" are ignored.  Instead, the Request Body, list of Responses, and Security Requirements drive those header values respectively.`,
    "PATH-3-002" : `There are multiple Path items with the same (or equivalent) path templates.  This is problematic because it is not possible to have different functionality available at the same endpoint URL.  Make sure all of your Path templates are unique.`,
    "SCH-3-001"  : `The "discriminator" property (which adds support for data type polymorphism) only makes sense when using "oneOf", "anyOf", or "allOf" schemas.  In all other cases there is nothing to discriminate.`,
    "SREQ-3-002" : `The value of the security requirement must be an array.  For security requirements that reference HTTP or API Key security schemes, the value of the security requirement must be an empty array (since scopes are not supported for those security types),`,
    "SREQ-3-003" : `The value of the security requirement must be an array (it cannot be missing or null).`,
    "SS-3-008"   : `All Security Schemes must have a type.  The supported security scheme types are "apiKey", "http", "oauth2", and "openIdConnect".`,
    "SS-3-010"   : `When defining an API Key security scheme, the value of the API Key must be located somewhere in the HTTP request.  For this reason, the "in" property is required and must have a value of "header", "query", or "cookie".`,
    "SS-3-011"   : `When defining an HTTP security scheme of type "bearer", you must describe the format of the bearer token.  This is done via the "bearerFormat" property, which is simply a hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.`,
    "SS-3-013"   : `When defining an HTTP security scheme, the type of security must be specified using the "scheme" property.  The value of this property must be the name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235.  Supported values are: "basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", and "scram-sha-256"`,
    "SVAR-3-003" : `The name of the Server Variable must match a variable found in the Server URL template.  For example, if the server URL template is "http://{domain}:{port}/ctx/{path}" then the Server Variable name must be either "domain", "port", or "path".`,
    "XML-3-002"  : `When defining the XML representation of a definition, one of the options is to declare an element must be wrapped (by another XML element).  However, this is only relevant for "array" type properties, since array properties may have multiple values that should be contained within a parent (wrapper) XML element.`,
    "CALL-3-001" : `The definition of the Callback attempts to reference a Callback found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Callback was deleted, or there is a typo in the reference.`,
    "EX-3-003"   : `The definition of the Example attempts to reference an Example found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Example was deleted, or there is a typo in the reference.`,
    "HEAD-3-005" : `The definition of the Header attempts to reference a Header found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Header was deleted, or there is a typo in the reference.`,
    "LINK-3-003" : `When present, the Link's "operationRef" property must reference an operation.  This operation is typically declared in the same API but may also exist in an external location.  Check to make sure that the reference is valid and that the target Operation exists.`,
    "LINK-3-005" : `The definition of the LInk attempts to reference a Link found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Link was deleted, or there is a typo in the reference.`,
    "PAR-3-017"  : `The definition of the Parameter attempts to reference a Parameter found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Parameter was deleted, or there is a typo in the reference.`,
    "RB-3-003"   : `The definition of the Request Body attempts to reference a Request Body found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Request Body was deleted, or there is a typo in the reference.`,
    "RES-3-004"  : `The definition of the Response attempts to reference a Response found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Response was deleted, or there is a typo in the reference.`,
    "SCH-3-002"  : `The definition of the Schema attempts to reference a Schema found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Schema was deleted, or there is a typo in the reference.`,
    "SS-3-012"   : `The definition of the Callback attempts to reference a Callback found elsewhere (typically globally declared Components section of the same API document) but the reference could not be resolved.  Perhaps the global Callback was deleted, or there is a typo in the reference.`,
    "EX-3-002"   : `When defining an Example, either an inline value or an external value must be provided, but not both.`,
    "HEAD-3-006" : `When providing the data type for a header, it must be defined either in a schema or a content object, but not both.`,
    "HEAD-3-007" : `When including an example of a header value, it must be provided either in an "example" or "examples" property, but not both.`,
    "LINK-3-001" : `Every link must reference an existing Operation, by specifying either a "operationRef" or an "operationId" (but not both).`,
    "MT-3-001"   : `When including an example of a media type, it must be provided either in an "example" or "examples" property, but not both.`,
    "PAR-3-008"  : `When providing the data type for a parameter, it must be defined either in a schema or a content object, but not both.`,
    "PAR-3-015"  : `When including an example of a parameter value, it must be provided either in an "example" or "examples" property, but not both.`,
    "DISC-3-001" : `When using a discriminator, specifying a schema property name is required.`,
    "ED-3-002"   : `Every external documentation must include a URL to the location of the external information.`,
    "FLOW-3-001" : `Both Implicit and Authorization Code style OAuth flows require a valid Authorization URL to be configured.`,
    "FLOW-3-002" : `The Implicit, Authorization Code, and Client Credentials style OAuth flows all require a valid Token URL to be configured.`,
    "FLOW-3-006" : `All OAuth flows must define their allowed set of scopes.`,
    "INF-3-001"  : `A title must be included for every API definition.`,
    "INF-3-002"  : `A version must be included for every API definition.`,
    "LIC-3-001"  : `The name of the License must be provided.`,
    "OP-3-004"   : `Every Operation must include at least one Response.`,
    "PAR-3-003"  : `Every Parameter must have a name.`,
    "PAR-3-004"  : `For every Parameter, where it can be found in the Request must be indicated (e.g. path, query, header).`,
    "R-3-001"    : `The API definition must contain an "openapi" property (with a value of e.g. 3.0.1).`,
    "R-3-002"    : `The API definition must include an Info child (which must contain the API title and version).`,
    "R-3-003"    : `Every API definition must include a "paths" property even if there are no actual Path Items contained in it.`,
    "RB-3-002"   : `Every Request Body must define its Content so that clients know what format the Operation's input data must be.`,
    "SRV-3-001"  : `The Server definition must include a URL template indicating the real endpoint location of the server.`,
    "SS-3-001"   : `Every Security Scheme must include a type, which indicates what kind of security is required (e.g. HTTP, API Key, etc).`,
    "SS-3-002"   : `Every API Key style Security Scheme must define a name which, along with the "in" property, indicates where in the Request the API Key should be found.`,
    "SS-3-003"   : `Every API Key style Security Scheme must define a location within the Request where the API key can be found (e.g. in the headers or query string).`,
    "SS-3-004"   : `Every HTTP style Security Scheme must indicate what HTTP Security scheme should be used (e.g. Basic, Digest).`,
    "SS-3-005"   : `When specifying an OAuth style Security Scheme, at least one OAuth flow must be configured.`,
    "SS-3-006"   : `When specifying an Open Id Connect style Security Scheme, the Open ID Connect URL must be configured.`,
    "SVAR-3-001" : `Every Server Variable must be configured with a default value.`,
    "TAG-3-001"  : `All configured Tags must have a name.`,
    "OP-3-002"   : `If an Operation ID is defined for an Operation, it must be unique across all operations in the API.`,
    "PAR-3-001"  : `Parameters are uniquely defined by their "name" and their "location" (path, query, formData, etc).  You cannot have two Parameters with the same combination of name and location.  Please make sure that all of your parameters are appropriately unique based on these two criteria.`,
    "TAG-3-003"  : `Each Tag must have a unique name (no duplicate tag names are allowed).`
};



/**
 * A simple service providing information and functionality about validation problems.
 * This includes providing more information (explanation) about any given problem type
 * as well as "quick fix" functionality.
 */
@Injectable()
export class ProblemsService {

    /**
     * Returns a full human-readable explanation for the given validation problem or
     * null if it doesn't have more information about it.
     * @param problem
     */
    public explanation(problem: OasValidationError): string {
        let explanation: string = PROBLEM_EXPLANATIONS[problem.errorCode];
        if (!explanation) {
            explanation = "No additional information found.";
        }
        return explanation;
    }

}
