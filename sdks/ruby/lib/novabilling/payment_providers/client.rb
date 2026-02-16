# frozen_string_literal: true

module Novabilling
  module PaymentProviders
    class Client
      # @param client [Novabilling::Internal::Http::RawClient]
      #
      # @return [void]
      def initialize(client:)
        @client = client
      end

      # Retrieve all configured payment providers for the tenant. Credentials are never returned.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Array[Novabilling::Types::PaymentProviderResponse]]
      def list(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/payment-providers",
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

      # Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider
      # with the lowest priority number is used by default for checkout.
      #
      # @param request_options [Hash]
      # @param params [Novabilling::PaymentProviders::Types::CreateProviderDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Novabilling::Types::PaymentProviderResponse]
      def configure(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/payment-providers",
          body: Novabilling::PaymentProviders::Types::CreateProviderDto.new(params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentProviderResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Retrieve a specific payment provider configuration. Credentials are not included.
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
      # @return [Novabilling::Types::PaymentProviderResponse]
      def get(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/payment-providers/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentProviderResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Remove a payment provider configuration. This does not affect existing payments.
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
      # @return [Novabilling::Types::PaymentProviderResponse]
      def delete(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "DELETE",
          path: "api/payment-providers/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentProviderResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Update provider settings such as active status, priority, or credentials.
      #
      # @param request_options [Hash]
      # @param params [Novabilling::PaymentProviders::Types::UpdateProviderDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :id
      #
      # @return [Novabilling::Types::PaymentProviderResponse]
      def update(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request_data = Novabilling::PaymentProviders::Types::UpdateProviderDto.new(params).to_h
        non_body_param_names = ["id"]
        body = request_data.except(*non_body_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "PATCH",
          path: "api/payment-providers/#{params[:id]}",
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
          Novabilling::Types::PaymentProviderResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Verify that the provider credentials are valid by making a test API call to the provider.
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
      # @return [Novabilling::Types::ProviderTestResponse]
      def test_connection(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/payment-providers/#{params[:id]}/test",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::ProviderTestResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end
    end
  end
end
