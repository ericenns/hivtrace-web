$(document).ready(function() {


    $("input[name='public_db_compare']").tooltip()
    var prealigned = false;

    $("form").submit(function(e) {

        //Trigger elements

        $("input").trigger('focusout');

        $(this).next('.help-block').remove();

        // File upload
        var file_element = d3.select('#seq-file'),
            file_list = file_element.property('files');

        if (file_list.length == 0) {
          file_element = d3.select('#aligned-seq-file');
          file_list = file_element.property('files');
          prealigned = true;
        }

        if (file_list.length == 0) {
          display_validation_fail_block(file_element, 'No sequence file chosen');
          return false;
        } else {
          field_passes_validation(file_element);
        }

        if ($(this).find(".has-error").length > 0) {
          $("#form-has-error").show();
          return false;
        }

        // remove empty files from form
        if (d3.select('#seq-file').property('files').length == 0) {
          d3.select('#seq-file').remove();
        }
        if (d3.select('#aligned-seq-file').property('files').length == 0) {
          d3.select('#aligned-seq-file').remove();
        }
        if (d3.select('#reference-file').property('files').length == 0) {
          d3.select('#reference-file').remove();
        }


        // end file upload
    });

    function display_validation_fail_block(field, message) {
        $(field).next('.help-block').remove();
        $(field).parent().removeClass('has-success').addClass('has-error');


        return jQuery('<span/>', {
            class: 'help-block',
            text: message
        }).insertAfter($(field));
    }

    function field_passes_validation(field) {
        $(field).parent().removeClass('has-error').addClass('has-success');
        $(field).next('.help-block').remove();
    }

    function field_has_no_data(field) {
        $(field).parent().removeClass('has-error has-success');
        $(field).next('.help-block').remove();
    }


    // Validate an element that has min and max values
    var validate_element = function() {
        // see if the field is hidden; is so ignore it

        if ($(this).filter(":hidden").size()) {
            return true;
        }

        var value = $(this).val();

        if (value == "") { // try default
            value = $(this).prop("placeholder");
        }

        var parsed_float = parseFloat(value);

        // this checks for NaN
        if (parsed_float !== parsed_float) {
            display_validation_fail_block(this, "Please enter a number in this field");
            return false;
        }

        // this checks for range compliance    
        if (parsed_float < $(this).data('min') || parsed_float > $(this).data('max')) {
            display_validation_fail_block(this, "The value you entered is out of the permissible range [" + $(this).data('min') + " - " + $(this).data('max') + "]");
            return false;
        }

        field_passes_validation(this);
        $(this).val(value); // set the value to what was parsed and validated (e.g. the default)
        return true;
    }

    function validate_email_regexp(email) {
        // from http://badsyntax.co/post/javascript-email-validation-rfc822
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    }

    function validate_email(email) {

        var mail_field = $(this).find("input[name='receive_mail']");


        if (mail_field.filter(":checked").size() == 1) {
            if (validate_email_regexp($(this).find("input[name='mail']").val())) {
                field_passes_validation(mail_field.parent().parent());
            } else {
                display_validation_fail_block(mail_field.parent().parent(), "Please enter a valid e-mail address");
                return false;
            }
        } else {
            field_has_no_data(mail_field.parent().parent());
        }
        return true;
    }

    function handle_helper_element(obj) {
        var selected_option = $(obj).find(":selected");
        var help_text = $(selected_option).data("help_text");
        if (help_text) {
            $("#" + $(obj).attr("id") + "-help").html(help_text);
        }
    }

    function toggle_compare(obj) {

        if ($(this).find(":selected").data('dram')) {
            $("#dram").removeClass("hide").show();
        } else {
            $("#dram").hide().find("select").val("no").trigger("change");
        }

        if ($(this).find(":selected").data('can_compare')) {
            $("input[name='public_db_compare']").parent().show();
            $("#compare-notification").hide();
        } else {
            $("input[name='public_db_compare']").prop("checked", false).parent().hide();
            $("#compare-notification").removeClass("hide").show();
        }

        if ($(this).val() != "Custom") {
            $("#trace-reference-upload").hide();
        } else {
            $("#trace-reference-upload").removeClass('hide').show();
        }

        handle_helper_element(this);

    }

    function toggle_fraction(obj) {
        if ($(this).val() != "RESOLVE") {
            $("input[name='fraction']").val('');
            $("#fraction").hide();
        } else {
            $("#fraction").removeClass("hide").show();
        }

        handle_helper_element(this);
    }

    function toggle_helper(obj) {
        handle_helper_element(this);
    }


    $("input[name='distance_threshold']").focusout(validate_element);
    $("input[name='min_overlap']").focusout(validate_element);
    $("input[name='fraction']").focusout(validate_element);
    $(".mail-group").change(validate_email);
    $("#seq-file").change(function(e) {
        field_passes_validation(this);
    });
    $("#aligned-seq-file").change(function(e) {
        field_passes_validation(this);
    });
    $("select[name='reference']").change(toggle_compare).trigger('change');
    $("select[name='ambiguity_handling']").change(toggle_fraction).trigger('change');
    $("select[name='strip_drams']").change(toggle_helper).trigger('change');
    $("select[name='filter_edges']").change(toggle_helper).trigger('change');
    $("select[name='reference_strip']").change(toggle_helper).trigger('change');

    // set shared attributes on helper_text element
    $(".helper_text").attr("data-container", "body")
        .attr("data-toggle", "popover")
        .attr("data-trigger", "hover click")
        .attr("data-placement", "bottom")
        .attr("data-html", "true");


    // initialize helper toggles
    $(function() {
        $('[data-toggle="popover"]').popover()
    });


    function uploaded_file_change() {
      var input = $(this);
      var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      d3.select("#fasta-button").style('display', 'none');
      d3.select("#aligned-fasta-button").style('display', 'none');
      d3.select("#upload-file-info").html(label);

    }

    d3.select('#seq-file').on('change', uploaded_file_change);
    d3.select('#aligned-seq-file').on('change', uploaded_file_change);

});
