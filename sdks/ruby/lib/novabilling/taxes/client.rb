# frozen_string_literal: true

module Novabilling
  module Taxes
    class Client
      # @param client [Novabilling::Internal::Http::RawClient]
      #
      # @return [void]
      def initialize(client:)
        @client = client
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [Boolean, nil] :applied_by_default
      # @option params [Integer, nil] :page
      # @option params [Integer, nil] :limit
      #
      # @return [Novabilling::Types::PaginatedTaxResponse]
      def list(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[applied_by_default page limit]
        query_params = {}
        query_params["appliedByDefault"] = params[:applied_by_default] if params.key?(:applied_by_default)
        query_params["page"] = params[:page] if params.key?(:page)
        query_params["limit"] = params[:limit] if params.key?(:limit)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/taxes",
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
          Novabilling::Types::PaginatedTaxResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
      #
      # @param request_options [Hash]
      # @param params [Novabilling::Taxes::Types::CreateTaxDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Novabilling::Types::TaxResponse]
      def create(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/taxes",
          body: Novabilling::Taxes::Types::CreateTaxDto.new(params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::TaxResponse.load(response.body)
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
      # @return [Novabilling::Types::TaxResponse]
      def get(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/taxes/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::TaxResponse.load(response.body)
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
      # @return [untyped]
      def delete(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "DELETE",
          path: "api/taxes/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Novabilling::Taxes::Types::UpdateTaxDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::TaxResponse]
      def update(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request_data = Novabilling::Taxes::Types::UpdateTaxDto.new(params).to_h
        non_body_param_names = ["id"]
        body = request_data.except(*non_body_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "PATCH",
          path: "api/taxes/#{params[:id]}",
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
          Novabilling::Types::TaxResponse.load(response.body)
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
      # @option params [String] :customer_id
      #
      # @return [Array[Novabilling::Types::TaxResponse]]
      def taxes_controller_get_customer_taxes(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/taxes/customer/#{params[:customer_id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Novabilling::Types::AssignTaxDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :customer_id
      #
      # @return [untyped]
      def assign_to_customer(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        path_param_names = %i[customer_id]
        body_params = params.except(*path_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/taxes/customer/#{params[:customer_id]}",
          body: Novabilling::Types::AssignTaxDto.new(body_params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :customer_id
      # @option params [String] :tax_id
      #
      # @return [untyped]
      def remove_from_customer(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "DELETE",
          path: "api/taxes/customer/#{params[:customer_id]}/#{params[:tax_id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :plan_id
      #
      # @return [Array[Novabilling::Types::TaxResponse]]
      def taxes_controller_get_plan_taxes(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/taxes/plan/#{params[:plan_id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Novabilling::Types::AssignTaxDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :plan_id
      #
      # @return [untyped]
      def assign_to_plan(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        path_param_names = %i[plan_id]
        body_params = params.except(*path_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/taxes/plan/#{params[:plan_id]}",
          body: Novabilling::Types::AssignTaxDto.new(body_params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :plan_id
      # @option params [String] :tax_id
      #
      # @return [untyped]
      def remove_from_plan(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "DELETE",
          path: "api/taxes/plan/#{params[:plan_id]}/#{params[:tax_id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Novabilling::Types::AssignTaxDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :charge_id
      #
      # @return [untyped]
      def assign_to_charge(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        path_param_names = %i[charge_id]
        body_params = params.except(*path_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/taxes/charge/#{params[:charge_id]}",
          body: Novabilling::Types::AssignTaxDto.new(body_params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end

      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :charge_id
      # @option params [String] :tax_id
      #
      # @return [untyped]
      def remove_from_charge(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "DELETE",
          path: "api/taxes/charge/#{params[:charge_id]}/#{params[:tax_id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        return if code.between?(200, 299)

        error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
        raise error_class.new(response.body, code: code)
      end
    end
  end
end
