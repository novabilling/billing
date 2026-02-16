# frozen_string_literal: true

module Novabilling
  module PaymentMethods
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
      #
      # @return [untyped]
      def list(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/payment-methods",
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
      # @param params [Novabilling::PaymentMethods::Types::CreatePaymentMethodDto]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Novabilling::Types::PaymentMethodResponse]
      def create(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "api/payment-methods",
          body: Novabilling::PaymentMethods::Types::CreatePaymentMethodDto.new(params).to_h,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentMethodResponse.load(response.body)
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
      # @return [Array[Novabilling::Types::PaymentMethodResponse]]
      def get_by_customer(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/payment-methods/customer/#{params[:customer_id]}",
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
      # @option params [String] :id
      #
      # @return [Novabilling::Types::PaymentMethodResponse]
      def get(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/payment-methods/#{params[:id]}",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentMethodResponse.load(response.body)
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
          path: "api/payment-methods/#{params[:id]}",
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
      # @option params [String] :id
      #
      # @return [Novabilling::Types::PaymentMethodResponse]
      def set_default(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "PATCH",
          path: "api/payment-methods/#{params[:id]}/set-default",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentMethodResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end
    end
  end
end
