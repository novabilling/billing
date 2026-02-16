# frozen_string_literal: true

module Novabilling
  module CreditNotes
    class Client
      # @param client [Novabilling::Internal::Http::RawClient]
      #
      # @return [void]
      def initialize(client:)
        @client = client
      end

      # Retrieve a paginated list of credit notes.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :customer_id
      # @option params [String, nil] :invoice_id
      # @option params [Novabilling::CreditNotes::Types::ListCreditNotesRequestStatus, nil] :status
      # @option params [Integer, nil] :page
      # @option params [Integer, nil] :limit
      #
      # @return [Novabilling::Types::PaginatedCreditNoteResponse]
      def list(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[customer_id invoice_id status page limit]
        query_params = {}
        query_params["customerId"] = params[:customer_id] if params.key?(:customer_id)
        query_params["invoiceId"] = params[:invoice_id] if params.key?(:invoice_id)
        query_params["status"] = params[:status] if params.key?(:status)
        query_params["page"] = params[:page] if params.key?(:page)
        query_params["limit"] = params[:limit] if params.key?(:limit)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/credit-notes",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaginatedCreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Create a credit note against an invoice. Starts in DRAFT status.
      #
      # @param request_options [Hash]
      # @param params [Novabilling::CreditNotes::Types::CreateCreditNoteDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Novabilling::Types::CreditNoteResponse]
      def create(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/credit-notes",
          body: Novabilling::CreditNotes::Types::CreateCreditNoteDto.new(params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::CreditNoteResponse]
      def get(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/credit-notes/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # @param request_options [Hash]
      # @param params [Novabilling::CreditNotes::Types::UpdateCreditNoteDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::CreditNoteResponse]
      def credit_notes_controller_update(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request_data = Novabilling::CreditNotes::Types::UpdateCreditNoteDto.new(params).to_h
        non_body_param_names = ["id"]
        body = request_data.except(*non_body_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "PATCH",
          path: "api/credit-notes/#{params[:id]}",
          body: body,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Move a credit note from DRAFT to FINALIZED status.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::CreditNoteResponse]
      def finalize(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/credit-notes/#{params[:id]}/finalize",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Cancel a credit note.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::CreditNoteResponse]
      def void(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/credit-notes/#{params[:id]}/void",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CreditNoteResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end
    end
  end
end
