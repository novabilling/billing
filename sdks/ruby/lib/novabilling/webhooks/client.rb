# frozen_string_literal: true

module Novabilling
  module Webhooks
    class Client
      # @param client [Novabilling::Internal::Http::RawClient]
      #
      # @return [void]
      def initialize(client:)
        @client = client
      end

      # Receives payment event notifications from Paystack. The signature is verified using HMAC-SHA512 with the
      # provider's secret key. On success, updates the payment/invoice status and sends customer notifications.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :paystack_signature
      #
      # @return [untyped]
      def webhooks_controller_paystack(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        headers = {}
        headers["x-paystack-signature"] = params[:paystack_signature] if params[:paystack_signature]

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/paystack",
          headers: headers,
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

      # Receives payment event notifications from Flutterwave. Verified using the verif-hash header against the
      # configured encryption key.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :verif_hash
      #
      # @return [untyped]
      def webhooks_controller_flutterwave(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        headers = {}
        headers["verif-hash"] = params[:verif_hash] if params[:verif_hash]

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/flutterwave",
          headers: headers,
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

      # Receives payment callback notifications from DPO Group (DirectPay Online). Verifies the transaction token status
      # and updates payment accordingly.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [untyped]
      def webhooks_controller_dpo(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/dpo",
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

      # Receives Instant Payment Notifications (IPN) from PayU South Africa. Updates payment status based on the
      # transaction state.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [untyped]
      def webhooks_controller_payu(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/payu",
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

      # Receives IPN (Instant Payment Notification) callbacks from Pesapal. Fetches transaction status using the
      # OrderTrackingId and updates payment.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [untyped]
      def webhooks_controller_pesapal(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/pesapal",
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

      # Receives event notifications from Stripe (e.g. checkout.session.completed, payment_intent.succeeded). Verified
      # using the stripe-signature header with the configured webhook secret.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String] :stripe_signature
      #
      # @return [untyped]
      def webhooks_controller_stripe(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        headers = {}
        headers["stripe-signature"] = params[:stripe_signature] if params[:stripe_signature]

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "POST",
          path: "webhooks/stripe",
          headers: headers,
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
